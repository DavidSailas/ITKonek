import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  /* HEADER */
  header: {
    backgroundColor: '#111',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    height: '100%',
  },

  /* MAP */
  mapContainer: {
  margin: 20,
  borderRadius: 15,
  overflow: 'hidden',
  backgroundColor: '#ddd',
  height: 200,
  position: 'relative', // needed for absolute dots
},

mapImage: {
  width: '100%',
  height: '100%',
},

engineerDot: {
  position: 'absolute',
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#ff0000ff',
  borderWidth: 2,
  borderColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
},

  /* SEARCH RESULTS */
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80, // space for bottom nav
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  engineerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  engineerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },
  engineerService: {
    color: '#888',
    fontSize: 14,
  },
  engineerDistance: {
    color: '#aaa',
    fontSize: 12,
  },
  bookBtn: {
    backgroundColor: '#222',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});