import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
    marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  techCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  techAvatar: { width: 50, height: 50, borderRadius: 25 },
  techInfo: { flex: 1, marginLeft: 15 },
  techName: { fontSize: 15, fontWeight: '600', color: '#000' },
  techSpecialty: { fontSize: 13, color: '#666', marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  locationText: { fontSize: 12, color: '#888' },
  bookBtn: {
    backgroundColor: '#000',
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});