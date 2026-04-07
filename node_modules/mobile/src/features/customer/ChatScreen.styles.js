import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // INBOX
  mainHeader: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 24, paddingBottom: 20 },
  mainTitle: { fontSize: 32, fontWeight: '900', color: '#111', letterSpacing: -1 },
  inboxItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: 1, borderColor: '#F5F5F5' },
  inboxAvatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#F0F0F0' },
  inboxContent: { flex: 1, marginLeft: 16 },
  inboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  inboxName: { fontSize: 16, fontWeight: '700', color: '#111' },
  inboxStatusText: { fontSize: 10, fontWeight: '800' },
  
  inboxMessageRow: { flexDirection: 'row', alignItems: 'center' },
  inboxSub: { fontSize: 14, flexShrink: 1 },
  unreadText: { color: '#000', fontWeight: '800' }, 
  readText: { color: '#666', fontWeight: '400' },   
  inboxTimeSmall: { fontSize: 12, color: '#999', marginLeft: 4 },

  // CHAT HEADER
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, paddingTop: Platform.OS === 'ios' ? 55 : 35, borderBottomWidth: 1, borderColor: '#EEE' },
  backCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, marginLeft: 10 },
  userName: { fontSize: 17, fontWeight: '800', color: '#111' },
  statusText: { fontSize: 11, color: '#666', fontWeight: '600' },

  // EMPTY STATE (PROFESSIONAL & REALISTIC)
  emptyContainer: { flex: 1, paddingHorizontal: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 100 },
  emptyIllustration: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  emptyCircleLarge: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: '#F9FAFB' },
  emptyCircleSmall: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3F4F6', top: 10, right: 0 },
  emptyHeading: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 10, textAlign: 'center' },
  emptyDescription: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  emptyButton: { backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  // MESSAGES
  listPadding: { paddingHorizontal: 20, paddingTop: 20 },
  msgWrapper: { maxWidth: '85%' },
  msgLeft: { alignSelf: 'flex-start' },
  msgRight: { alignSelf: 'flex-end' },
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 22 },
  customerBubble: { backgroundColor: '#111', borderBottomRightRadius: 4 },
  engineerBubble: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  textWhite: { color: '#FFF', fontSize: 15 },
  textBlack: { color: '#111', fontSize: 15 },
  timeText: { fontSize: 10, color: '#AAA', fontWeight: '500' },
  seenText: { fontSize: 10, color: '#AAA', fontWeight: '700' },

  // INPUT
  inputWrapper: { paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderColor: '#EEE' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 28, paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#EEE' },
  inputField: { flex: 1, fontSize: 15, color: '#111' },
  sendBtn: { backgroundColor: '#111', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  // FINISHED STATUS
  completionSummary: { padding: 30, alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 24, marginVertical: 20 },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginTop: 15 },
  summaryText: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 8 },
  readOnlyWrapper: { paddingVertical: 24, alignItems: 'center', borderTopWidth: 1, borderColor: '#EEE' },
  readOnlyText: { color: '#BBB', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
});