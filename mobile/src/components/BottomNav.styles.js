import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },

  activeCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});