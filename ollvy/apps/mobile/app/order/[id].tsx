// U15 Order Detail Screen
// Spec:
// - Order status, current stage, SLA countdown
// - Stages stepper showing completed/current/upcoming
// - Documents section with document requests
// - "Open Chat" button - navigates to chat screen
// - "Open Dispute" button - visible when in_progress and past 24h
// - Dispute status banner when status=disputed
// - Download Invoice button (calls get-invoice-url, opens signed URL)

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase, getEdgeFunctionUrl } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

interface WorkflowStage {
  stage_key: string;
  stage_name: string;
  sla_working_days: number;
}

interface StageHistory {
  id: string;
  stage_key: string;
  stage_name: string;
  started_at: string;
  completed_at: string | null;
  stage_due_date: string | null;
}

interface Document {
  id: string;
  document_type: string;
  file_url: string;
  created_at: string;
}

interface DocumentRequest {
  id: string;
  message: string;
  due_date: string | null;
  fulfilled_at: string | null;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  order_type: string;
  city: string;
  price_base_paisa_snapshot: number;
  price_govt_fees_paisa_snapshot: number;
  price_gst_paisa_snapshot: number;
  total_paisa_snapshot: number;
  created_at: string;
  assigned_at: string | null;
  completed_at: string | null;
  service_packages: {
    id: string;
    name: string;
    short_description: string;
    workflow_stages: WorkflowStage[];
    sla_working_days: number;
  };
  professionals: {
    id: string;
    name: string;
  } | null;
}

// Format paisa to rupees
function formatPaisa(paisa: number): string {
  const rupees = paisa / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

// Format date
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Get status color
function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'pending_payment':
      return { bg: '#FEF3C7', text: '#92400E' };
    case 'paid':
    case 'assigned':
      return { bg: '#DBEAFE', text: '#1E40AF' };
    case 'waitlisted':
      return { bg: '#FEE2E2', text: '#991B1B' };
    case 'in_progress':
      return { bg: '#D1FAE5', text: '#065F46' };
    case 'completed':
      return { bg: '#EEF2FF', text: '#4338CA' };
    case 'disputed':
      return { bg: '#FEE2E2', text: '#991B1B' };
    case 'cancelled':
      return { bg: '#F3F4F6', text: '#6B7280' };
    default:
      return { bg: '#F3F4F6', text: '#6B7280' };
  }
}

// Format status label
function formatStatus(status: string): string {
  switch (status) {
    case 'pending_payment':
      return 'Pending Payment';
    case 'paid':
      return 'Paid';
    case 'assigned':
      return 'Specialist Assigned';
    case 'waitlisted':
      return 'In Queue';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'disputed':
      return 'Under Review';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [stageHistory, setStageHistory] = useState<StageHistory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // Dispute state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [submittingDispute, setSubmittingDispute] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch order with service and professional
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          service_packages!inner (id, name, short_description, workflow_stages, sla_working_days),
          professionals (id, name)
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch stage history
      const { data: historyData } = await supabase
        .from('order_stage_history')
        .select('*')
        .eq('order_id', id)
        .order('started_at', { ascending: true });

      setStageHistory(historyData || []);

      // Fetch documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('order_id', id)
        .eq('visible_to_user', true)
        .order('created_at', { ascending: false });

      setDocuments(docsData || []);

      // Fetch document requests
      const { data: reqData } = await supabase
        .from('document_requests')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

      setDocumentRequests(reqData || []);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);

    try {
      // First get the invoice for this order
      const { data: invoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('order_id', id)
        .single();

      if (!invoice) {
        Alert.alert('Info', 'Invoice is being generated. Please try again in a moment.');
        return;
      }

      // Get signed URL
      const response = await fetch(
        `${getEdgeFunctionUrl('get-invoice-url')}?invoice_id=${invoice.id}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (data.ok && data.url) {
        // Open URL in browser
        await Linking.openURL(data.url);
      } else if (data.pdf_pending) {
        Alert.alert('Info', data.message);
      } else {
        Alert.alert('Error', 'Failed to get invoice download link');
      }
    } catch (err) {
      console.error('Download invoice error:', err);
      Alert.alert('Error', 'Failed to download invoice');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handleOpenChat = () => {
    router.push(`/order/${id}/chat`);
  };

  const canOpenDispute = (): boolean => {
    if (!order) return false;

    // Can dispute in_progress orders (past 24h) or completed orders (within 7 days)
    if (order.status === 'in_progress' && order.assigned_at) {
      const assignedDate = new Date(order.assigned_at);
      const now = new Date();
      const hoursSinceAssignment = (now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60);
      return hoursSinceAssignment >= 24;
    }

    if (order.status === 'completed' && order.completed_at) {
      const completedDate = new Date(order.completed_at);
      const now = new Date();
      const daysSinceCompletion = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCompletion <= 7;
    }

    return false;
  };

  const handleOpenDispute = async () => {
    if (!disputeReason) {
      Alert.alert('Error', 'Please select a reason for the dispute');
      return;
    }

    setSubmittingDispute(true);
    try {
      const response = await fetch(getEdgeFunctionUrl('open-dispute'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          order_id: id,
          reason_category: disputeReason,
          description: disputeDescription.trim() || null,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setShowDisputeModal(false);
        setDisputeReason('');
        setDisputeDescription('');
        Alert.alert(
          'Dispute Submitted',
          'Our team will review your dispute within 48 hours. You will be notified of the outcome.',
          [{ text: 'OK', onPress: fetchOrder }]
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to submit dispute');
      }
    } catch (err) {
      console.error('Failed to open dispute:', err);
      Alert.alert('Error', 'Failed to submit dispute. Please try again.');
    } finally {
      setSubmittingDispute(false);
    }
  };

  const handleDownloadDocument = async (fileUrl: string) => {
    try {
      await Linking.openURL(fileUrl);
    } catch (err) {
      Alert.alert('Error', 'Failed to open document');
    }
  };

  const disputeReasons = [
    { value: 'service_not_delivered', label: 'Service not delivered' },
    { value: 'poor_quality', label: 'Poor quality of work' },
    { value: 'delays', label: 'Excessive delays' },
    { value: 'wrong_deliverable', label: 'Wrong deliverable provided' },
    { value: 'communication_issues', label: 'Communication issues' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Order Details', headerBackTitle: 'Back' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors = getStatusColor(order.status);
  const workflowStages = order.service_packages.workflow_stages || [];
  const completedStages = stageHistory.filter(s => s.completed_at);
  const currentStageIndex = completedStages.length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Order Details',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dispute Banner */}
        {order.status === 'disputed' && (
          <View style={styles.disputeBanner}>
            <Text style={styles.disputeBannerIcon}>⚠️</Text>
            <View style={styles.disputeBannerContent}>
              <Text style={styles.disputeBannerTitle}>Dispute Under Review</Text>
              <Text style={styles.disputeBannerText}>
                Our team is reviewing your dispute. You will be notified of the outcome within 48 hours.
              </Text>
            </View>
          </View>
        )}

        {/* Order Header */}
        <View style={styles.header}>
          <Text style={styles.serviceName}>{order.service_packages.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {formatStatus(order.status)}
            </Text>
          </View>
          <Text style={styles.orderDate}>Ordered on {formatDate(order.created_at)}</Text>
        </View>

        {/* Professional Info */}
        {order.professionals && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Specialist</Text>
            <View style={styles.professionalCard}>
              <View style={styles.professionalAvatar}>
                <Text style={styles.professionalInitial}>
                  {order.professionals.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName}>{order.professionals.name}</Text>
                <Text style={styles.professionalLabel}>Ollvy Compliance Team</Text>
              </View>
            </View>
          </View>
        )}

        {/* Stage Progress */}
        {workflowStages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <View style={styles.stagesContainer}>
              {workflowStages.map((stage, index) => {
                const historyItem = stageHistory.find(h => h.stage_key === stage.stage_key);
                const isCompleted = !!historyItem?.completed_at;
                const isCurrent = index === currentStageIndex && !isCompleted;
                const isUpcoming = index > currentStageIndex;

                return (
                  <View key={stage.stage_key} style={styles.stageItem}>
                    <View style={styles.stageIndicatorColumn}>
                      <View style={[
                        styles.stageIndicator,
                        isCompleted && styles.stageIndicatorCompleted,
                        isCurrent && styles.stageIndicatorCurrent,
                        isUpcoming && styles.stageIndicatorUpcoming,
                      ]}>
                        {isCompleted && <Text style={styles.stageCheckmark}>✓</Text>}
                        {isCurrent && <View style={styles.stageDot} />}
                      </View>
                      {index < workflowStages.length - 1 && (
                        <View style={[
                          styles.stageLine,
                          isCompleted && styles.stageLineCompleted,
                        ]} />
                      )}
                    </View>
                    <View style={styles.stageContent}>
                      <Text style={[
                        styles.stageName,
                        isCompleted && styles.stageNameCompleted,
                        isCurrent && styles.stageNameCurrent,
                        isUpcoming && styles.stageNameUpcoming,
                      ]}>
                        {stage.stage_name}
                      </Text>
                      {isCompleted && historyItem && (
                        <Text style={styles.stageDate}>
                          Completed {formatDate(historyItem.completed_at!)}
                        </Text>
                      )}
                      {isCurrent && historyItem?.stage_due_date && (
                        <Text style={styles.stageDue}>
                          Due by {formatDate(historyItem.stage_due_date)}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>{formatPaisa(order.price_base_paisa_snapshot)}</Text>
          </View>
          {order.price_govt_fees_paisa_snapshot > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Government Fees</Text>
              <Text style={styles.priceValue}>{formatPaisa(order.price_govt_fees_paisa_snapshot)}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST</Text>
            <Text style={styles.priceValue}>{formatPaisa(order.price_gst_paisa_snapshot)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatPaisa(order.total_paisa_snapshot)}</Text>
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>

          {/* Pending Document Requests */}
          {documentRequests.filter(r => !r.fulfilled_at).length > 0 && (
            <View style={styles.documentRequestsContainer}>
              <Text style={styles.documentRequestsTitle}>Action Required</Text>
              {documentRequests.filter(r => !r.fulfilled_at).map((req) => (
                <View key={req.id} style={styles.documentRequestCard}>
                  <Text style={styles.documentRequestIcon}>📎</Text>
                  <View style={styles.documentRequestContent}>
                    <Text style={styles.documentRequestMessage}>{req.message}</Text>
                    {req.due_date && (
                      <Text style={styles.documentRequestDue}>
                        Due by {formatDate(req.due_date)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Uploaded Documents */}
          {documents.length === 0 ? (
            <Text style={styles.emptyText}>No documents uploaded yet</Text>
          ) : (
            <View style={styles.documentsContainer}>
              {documents.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.documentCard}
                  onPress={() => handleDownloadDocument(doc.file_url)}
                >
                  <View style={styles.documentIcon}>
                    <Text style={styles.documentIconText}>📄</Text>
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentType}>
                      {doc.document_type.replace(/_/g, ' ')}
                    </Text>
                    <Text style={styles.documentDate}>
                      {formatDate(doc.created_at)}
                    </Text>
                  </View>
                  <Text style={styles.documentDownload}>↓</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenChat}>
            <Text style={styles.actionButtonText}>Open Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButtonSecondary, downloadingInvoice && styles.actionButtonDisabled]}
            onPress={handleDownloadInvoice}
            disabled={downloadingInvoice}
          >
            {downloadingInvoice ? (
              <ActivityIndicator size="small" color="#4F46E5" />
            ) : (
              <Text style={styles.actionButtonSecondaryText}>Download Invoice</Text>
            )}
          </TouchableOpacity>

          {/* Open Dispute Button */}
          {canOpenDispute() && (
            <TouchableOpacity
              style={styles.disputeButton}
              onPress={() => setShowDisputeModal(true)}
            >
              <Text style={styles.disputeButtonText}>Report an Issue</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Dispute Modal */}
      <Modal
        visible={showDisputeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDisputeModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDisputeModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Report an Issue</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalLabel}>What went wrong?</Text>
            <View style={styles.reasonsList}>
              {disputeReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.value}
                  style={[
                    styles.reasonOption,
                    disputeReason === reason.value && styles.reasonOptionSelected,
                  ]}
                  onPress={() => setDisputeReason(reason.value)}
                >
                  <View style={[
                    styles.reasonRadio,
                    disputeReason === reason.value && styles.reasonRadioSelected,
                  ]}>
                    {disputeReason === reason.value && (
                      <View style={styles.reasonRadioDot} />
                    )}
                  </View>
                  <Text style={styles.reasonLabel}>{reason.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Additional details (optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              multiline
              numberOfLines={4}
              placeholder="Please describe the issue in detail..."
              placeholderTextColor="#9CA3AF"
              value={disputeDescription}
              onChangeText={setDisputeDescription}
            />

            <View style={styles.warningBox}>
              <Text style={styles.warningIcon}>ℹ️</Text>
              <Text style={styles.warningText}>
                Our team will review your dispute within 48 hours. During this time, the specialist&apos;s payout will be held. If the dispute is resolved in your favor, you will receive a refund.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.submitDisputeButton,
                (!disputeReason || submittingDispute) && styles.submitDisputeButtonDisabled,
              ]}
              onPress={handleOpenDispute}
              disabled={!disputeReason || submittingDispute}
            >
              {submittingDispute ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitDisputeButtonText}>Submit Dispute</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  serviceName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  professionalInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  professionalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  stagesContainer: {
    paddingLeft: 4,
  },
  stageItem: {
    flexDirection: 'row',
    minHeight: 60,
  },
  stageIndicatorColumn: {
    alignItems: 'center',
    width: 32,
  },
  stageIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageIndicatorCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  stageIndicatorCurrent: {
    backgroundColor: '#fff',
    borderColor: '#4F46E5',
  },
  stageIndicatorUpcoming: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
  },
  stageCheckmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  stageLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 4,
  },
  stageLineCompleted: {
    backgroundColor: '#4F46E5',
  },
  stageContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  stageName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  stageNameCompleted: {
    color: '#4F46E5',
  },
  stageNameCurrent: {
    color: '#111827',
    fontWeight: '600',
  },
  stageNameUpcoming: {
    color: '#9CA3AF',
  },
  stageDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  stageDue: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5',
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonSecondary: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  // Dispute banner styles
  disputeBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FCD34D',
  },
  disputeBannerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  disputeBannerContent: {
    flex: 1,
  },
  disputeBannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  disputeBannerText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  // Documents section styles
  documentRequestsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  documentRequestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  documentRequestCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentRequestIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  documentRequestContent: {
    flex: 1,
  },
  documentRequestMessage: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  documentRequestDue: {
    fontSize: 13,
    color: '#B45309',
    marginTop: 4,
  },
  documentsContainer: {
    gap: 8,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentIconText: {
    fontSize: 18,
  },
  documentInfo: {
    flex: 1,
  },
  documentType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textTransform: 'capitalize',
  },
  documentDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  documentDownload: {
    fontSize: 20,
    color: '#4F46E5',
    paddingHorizontal: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Dispute button styles
  disputeButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  disputeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#4F46E5',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reasonsList: {
    marginBottom: 24,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reasonOptionSelected: {
    backgroundColor: '#EEF2FF',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderBottomColor: '#EEF2FF',
  },
  reasonRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonRadioSelected: {
    borderColor: '#4F46E5',
  },
  reasonRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  reasonLabel: {
    fontSize: 15,
    color: '#111827',
  },
  descriptionInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitDisputeButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitDisputeButtonDisabled: {
    backgroundColor: '#FCA5A5',
  },
  submitDisputeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
