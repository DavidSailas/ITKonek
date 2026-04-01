import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 30,
  },

  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  imageWrapper: {
    height: 260,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F2B2B',
    borderRadius: 30,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },

  image: {
    width: width * 0.75,
    height: width * 0.75,
    marginTop: -40,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -20,
  },

  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },

  nextButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 20,
    alignItems: 'center',
  },

  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },

  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});