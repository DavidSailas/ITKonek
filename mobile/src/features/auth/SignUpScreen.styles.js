import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size) => (SCREEN_WIDTH / 408) * size;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end', 
  },
  header: {
    flex: 1,
    minHeight: scale(130),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(40),
    paddingBottom: scale(10),
  },
  logo: {
    width: scale(72),
    height: scale(72),
    tintColor: '#fff',
    marginTop: 25,
  },
  title: {
    color: '#fff',
    fontSize: scale(22),
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40, // Added for symmetry
    borderTopRightRadius: 40,
    paddingTop: scale(30),
    paddingHorizontal: scale(25),
    paddingBottom: Platform.OS === 'ios' ? scale(45) : scale(25),
    width: '100%',
  },
  group: {
    marginBottom: scale(15),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: '600',
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
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: scale(50),
    backgroundColor: '#f8f8f8',
  },
  errorBorder: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: scale(14),
    color: '#333',
  },
  recaptcha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: scale(20),
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  recaptchaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  recaptchaText: {
    fontSize: scale(13),
    color: '#333',
  },
  recaptchaImageContainer: {
    width: scale(90),
    height: scale(60),
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recaptchaImage: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  recaptchaTitle: { color: '#fff', fontWeight: '700', fontSize: 8 },
  recaptchaSmall: { color: '#fff', fontSize: 7 },
  signUpBtn: {
    backgroundColor: '#000',
    paddingVertical: scale(16),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: scale(12),
  },
  signUpText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scale(16),
  },
  backToLoginText: {
    fontSize: scale(14),
    color: '#555',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  footer: {
    fontSize: scale(11),
    textAlign: 'center',
    color: '#888',
    marginTop: scale(10),
    paddingBottom: scale(10),
  },
  boldText: {
    fontWeight: 'bold',
    color: '#555',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  modalMessage: { fontSize: 14, textAlign: 'center', color: '#555', marginBottom: 20 },
  modalButton: { backgroundColor: '#000', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  modalButtonText: { color: '#fff', fontWeight: '600' },
});