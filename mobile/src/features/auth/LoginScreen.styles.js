import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scale factor based on Infinix GT 30 Pro width (408px)
const scale = (size) => (SCREEN_WIDTH / 408) * size;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: scale(60),
    paddingBottom: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scale(72),
    height: scale(72),
    marginBottom: 12,
    tintColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: scale(22),
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: scale(14),
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopRightRadius: 50,
    padding: scale(25),
    // Ensures content has space even on very short phones
    minHeight: scale(500), 
  },
  group: {
    marginBottom: scale(18),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: scale(13),
    color: '#333',
  },
  error: {
    color: '#DC2626', // Use a standard red
    fontSize: scale(11),
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: scale(52),
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
    marginVertical: scale(12),
  },
  remember: {
    fontSize: scale(12),
    color: '#555',
  },
  forgot: {
    fontSize: scale(12),
    color: '#555', 
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#000',
    padding: scale(15),
    borderRadius: 12,
    alignItems: 'center',
    marginTop: scale(10),
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
  divider: {
    textAlign: 'center',
    color: '#888',
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
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  footer: {
    marginTop: 'auto', // Pushes to bottom of formContainer
    paddingTop: scale(30),
    paddingBottom: scale(20),
    textAlign: 'center',
    color: '#555',
    fontSize: scale(14),
  },
  signUpLink: {
    color: '#555', 
    fontWeight: 'bold',
  }
});

export default styles;