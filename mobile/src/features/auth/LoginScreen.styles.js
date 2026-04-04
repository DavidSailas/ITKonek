import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size) => (SCREEN_WIDTH / 408) * size;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1, // Crucial: This section shrinks when keyboard is open
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(40),
  },
  logo: {
    width: scale(72),
    height: scale(72),
    marginBottom: 10,
    tintColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: scale(22),
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ccc',
    fontSize: scale(14),
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#F5F5F5', // Off-white as seen in your screenshot
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: scale(30),
    paddingTop: scale(35),
    paddingBottom: Platform.OS === 'ios' ? scale(45) : scale(30),
    width: '100%',
  },
  group: {
    marginBottom: scale(18),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    fontSize: scale(13),
    color: '#333',
  },
  error: {
    color: '#DC2626',
    fontSize: scale(11),
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: scale(54),
    backgroundColor: '#FFF',
  },
  errorBorder: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: scale(14),
    color: '#000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(10),
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#444',
    borderColor: '#444',
  },
  remember: {
    fontSize: scale(12),
    color: '#666',
  },
  forgot: {
    fontSize: scale(12),
    color: '#444',
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: '#000',
    height: scale(55),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(10),
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
  divider: {
    textAlign: 'center',
    color: '#999',
    marginVertical: scale(20),
    fontSize: scale(12),
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(15),
  },
  socialBtn: {
    width: scale(50),
    height: scale(50),
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    marginTop: scale(25),
    textAlign: 'center',
    color: '#777',
    fontSize: scale(13),
  },
  signUpLink: {
    color: '#000',
    fontWeight: 'bold',
  }
});