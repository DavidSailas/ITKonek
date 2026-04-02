import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: 11,
    right: 13,
    width: 7,
    height: 7,
    backgroundColor: 'red',
    borderRadius: 5,
  },

  /* SEARCH */
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    height: 45,
  },

  /* BODY */
  body: {
    padding: 20,
  },

  /* SERVICE CARD */
  serviceCard: {
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  serviceLabel: {
    color: '#aaa',
  },
  ticket: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  serviceTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  serviceSub: {
    color: '#ccc',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cardBtn: {
    width: 40,
    height: 30,
    backgroundColor: '#555',
    borderRadius: 8,
  },

  /* QUICK ACTIONS */
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
  },

  /* SECTION */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  seeAll: {
    color: '#888',
  },

  /* CHIPS */
  chipsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
  },

  /* GRID */
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: 120,
    backgroundColor: '#ddd',
    borderRadius: 15,
  },
});

export default styles;