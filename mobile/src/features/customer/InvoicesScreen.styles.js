import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 408;
const guidelineBaseHeight = 906;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 0 : (StatusBar.currentHeight || 0),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  backBtn: { marginRight: scale(15) },
  headerTitle: { fontSize: moderateScale(22), fontWeight: '800', color: '#111' },
  headerSub: { fontSize: moderateScale(13), color: '#888' },

  filterWrapper: { marginBottom: verticalScale(10) },
  filterScroll: { paddingHorizontal: scale(20) },
  filterTab: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(8),
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  activeFilterTab: { backgroundColor: '#111' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#666' },
  activeFilterText: { color: '#FFF' },

  listContent: { padding: scale(20) },
  receiptCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(18),
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  receiptDate: { fontSize: 11, color: '#AAA', fontWeight: '600', marginBottom: 4 },
  receiptService: { fontSize: 15, fontWeight: '700', color: '#111' },
  receiptPriceContainer: { flexDirection: 'row', alignItems: 'center' },
  receiptPrice: { fontSize: 15, fontWeight: '800', color: '#111', marginRight: 8 },

  // DETAIL VIEW STYLES
  detailContainer: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  detailHeaderTitle: { fontSize: 16, fontWeight: '800' },
  receiptScroll: { padding: 20 },
  mainReceipt: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 15 },
  statusBadgeText: { fontSize: 10, fontWeight: '800' },
  detailPrice: { fontSize: 32, fontWeight: '900', color: '#111', marginBottom: 5 },
  detailServiceTitle: { fontSize: 16, color: '#666', fontWeight: '500', marginBottom: 20 },
  divider: { width: '100%', height: 1, backgroundColor: '#EEE', marginVertical: 20, borderStyle: 'dashed' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  detailLabel: { color: '#AAA', fontSize: 13 },
  detailValue: { color: '#111', fontSize: 13, fontWeight: '700' },
  qrContainer: { alignItems: 'center', marginTop: 10 },
  qrTitle: { fontSize: 14, fontWeight: '700', marginBottom: 15 },
  qrFrame: { padding: 15, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#EEE' },
  qrSmallText: { fontSize: 11, color: '#AAA', textAlign: 'center', marginTop: 15, paddingHorizontal: 20 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#CCC', marginTop: 10, fontSize: 14 },
});