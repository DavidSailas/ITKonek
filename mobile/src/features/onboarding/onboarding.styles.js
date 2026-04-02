import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: '15%',
    paddingBottom: '10%',
  },

  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  imageWrapper: {
    marginTop: '40%',
    height: 270,
    width: 310,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F2B2B',
    borderRadius: 30,
    marginBottom: 20,
    overflow: 'visible',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },

  image: {
    width: 260,
    height: 260,
    marginTop: 50,
    borderRadius: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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