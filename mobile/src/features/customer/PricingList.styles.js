import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 408; // Based on your resolution
const guidelineBaseHeight = 906;

export const scale = (size) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // Added extra verticalScale(10) to push it away from the time/battery bar
    paddingTop: Platform.OS === 'ios' ? verticalScale(10) : (StatusBar.currentHeight || 0) + verticalScale(10),
  },
  header: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
    flexDirection: 'row', // This aligns arrow and text horizontally
    alignItems: 'center', // Centers the arrow vertically with the text block
  },
  backBtn: {
    marginRight: scale(16), // Space between arrow and text
    padding: scale(4),
  },
  headerTextContainer: {
    flex: 1, // Allows text to take up remaining space
  },
  headerTitle: {
    fontSize: moderateScale(22), // Adjusted slightly for better fit
    fontWeight: 'bold',
    color: '#000',
  },
  headerSub: {
    fontSize: moderateScale(13),
    color: '#666',
    marginTop: -2, // Pulls subtitle closer to title
  },
  tabWrapper: {
    marginVertical: verticalScale(10),
  },
  tabScroll: {
    paddingHorizontal: scale(20),
  },
  tab: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: 20,
    marginRight: scale(10),
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  serviceCard: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(20),
    marginBottom: verticalScale(15),
    padding: scale(15),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    // Professional aesthetic shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  serviceName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  servicePrice: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#000',
  },
  serviceDetail: {
    fontSize: moderateScale(13),
    color: '#666',
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimateText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  bookSmallBtn: {
    backgroundColor: '#000', // Black and White color scheme
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookSmallText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 30,
  },
  disclaimerBox: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FAFAFA',
    margin: 20,
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
    flex: 1,
  }
});