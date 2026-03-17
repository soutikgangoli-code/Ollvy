// U16 Chat Screen
// Subscribe to chat_messages via Supabase Realtime on mount
// Message list (newest at bottom, auto-scroll)
// Text input + send button
// File attachment button (uploads to /documents bucket, sends as message with file URL)
// Unread count cleared on open
// Shows professional name and avatar at top

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { supabase, getEdgeFunctionUrl } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/auth';

interface Message {
  id: string;
  sender_id: string | null;
  sender_type: 'user' | 'professional' | 'system';
  content: string;
  file_url: string | null;
  file_name: string | null;
  message_type: string;
  sent_at: string;
}

interface Order {
  id: string;
  order_number: string;
  chat_conversation_id: string;
  professionals: {
    id: string;
    name: string;
  } | null;
  service_packages: {
    name: string;
  };
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOrderAndMessages();
    setupRealtimeSubscription();
  }, [id]);

  const fetchOrderAndMessages = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch order with conversation
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          chat_conversation_id,
          professionals (id, name),
          service_packages (name)
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      // Transform Supabase array data to single objects
      const transformedOrder: Order = {
        ...orderData,
        professionals: Array.isArray(orderData.professionals) ? orderData.professionals[0] || null : orderData.professionals,
        service_packages: Array.isArray(orderData.service_packages) ? orderData.service_packages[0] : orderData.service_packages,
      };
      setOrder(transformedOrder);

      if (orderData?.chat_conversation_id) {
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', orderData.chat_conversation_id)
          .order('sent_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // Clear unread count by marking notifications as read
        await supabase
          .from('notifications')
          .update({ read_at: new Date().toISOString() })
          .eq('user_id', user?.id)
          .like('type', '%chat%')
          .is('read_at', null);
      }
    } catch (err) {
      console.error('Failed to fetch chat:', err);
      Alert.alert('Error', 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!id) return;

    // Get conversation ID first
    supabase
      .from('orders')
      .select('chat_conversation_id')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data?.chat_conversation_id) return;

        const channel = supabase
          .channel(`chat:${data.chat_conversation_id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `conversation_id=eq.${data.chat_conversation_id}`,
            },
            (payload) => {
              const newMsg = payload.new as Message;
              setMessages((prev) => {
                // Avoid duplicates
                if (prev.find((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              // Auto-scroll to bottom
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !order?.chat_conversation_id || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_id: user.id,
        sender_type: 'user',
        content: newMessage.trim(),
        message_type: 'text',
      });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const pickAndUploadFile = async () => {
    if (!order?.chat_conversation_id || !user) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      if (!file) return;

      // Check file size (max 10MB)
      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert('Error', 'File size must be less than 10MB');
        return;
      }

      setUploading(true);

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${order.id}/${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, blob, {
          contentType: file.mimeType || 'application/octet-stream',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Send message with file
      const { error: msgError } = await supabase.from('chat_messages').insert({
        conversation_id: order.chat_conversation_id,
        sender_id: user.id,
        sender_type: 'user',
        content: `Shared a file: ${file.name}`,
        file_url: urlData.publicUrl,
        file_name: file.name,
        message_type: 'file',
      });

      if (msgError) throw msgError;
    } catch (err) {
      console.error('Failed to upload file:', err);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender_type === 'user';
    const isSystem = item.sender_type === 'system';
    const showDate =
      index === 0 ||
      formatDate(item.sent_at) !== formatDate(messages[index - 1].sent_at);

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(item.sent_at)}</Text>
          </View>
        )}
        {isSystem ? (
          <View style={styles.systemMessage}>
            <Text style={styles.systemText}>{item.content}</Text>
          </View>
        ) : (
          <View
            style={[
              styles.messageContainer,
              isUser ? styles.userMessage : styles.professionalMessage,
            ]}
          >
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {item.content}
            </Text>
            {item.file_url && (
              <TouchableOpacity
                style={styles.fileLink}
                onPress={() => {
                  // Open file URL
                  // Linking.openURL(item.file_url);
                }}
              >
                <Text style={[styles.fileLinkText, isUser && styles.userFileLinkText]}>
                  📎 {item.file_name || 'Attachment'}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.timeText, isUser && styles.userTimeText]}>
              {formatTime(item.sent_at)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Chat', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order?.chat_conversation_id) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Chat', headerBackTitle: 'Back' }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chat not available for this order.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: order.professionals?.name || 'Chat',
          headerBackTitle: 'Back',
        }}
      />

      {/* Professional header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {order.professionals?.name?.charAt(0) || 'O'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.professionalName}>
            {order.professionals?.name || 'Ollvy Specialist'}
          </Text>
          <Text style={styles.serviceName}>{order.service_packages?.name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyMessagesText}>
                Start a conversation with your specialist
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={pickAndUploadFile}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#4F46E5" />
            ) : (
              <Text style={styles.attachIcon}>📎</Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  serviceName: {
    fontSize: 14,
    color: '#6B7280',
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessagesText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  professionalMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  fileLink: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  fileLinkText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  userFileLinkText: {
    color: 'rgba(255,255,255,0.9)',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 8,
    maxWidth: '90%',
  },
  systemText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendIcon: {
    fontSize: 18,
    color: '#fff',
  },
});
