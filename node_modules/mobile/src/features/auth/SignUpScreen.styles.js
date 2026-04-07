import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = (size) => (SCREEN_WIDTH / 408) * size;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  // Ensure the scroll view doesn't force the header off-screen
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: scale(220), // Fixed height instead of flex
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(40),
  },
  logo: {
    width: scale(80),
    height: scale(80),
    tintColor: '#fff',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: scale(26),
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: scale(14),
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: scale(30),
    paddingHorizontal: scale(28),
    paddingBottom: scale(60),
    width: '100%',
    // Min height ensures it looks good on both short and tall phones
    minHeight: Dimensions.get('window').height - scale(220), 
  },
  group: { marginBottom: scale(16) },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontWeight: '700', fontSize: scale(13), color: '#444' },
  error: { color: '#DC2626', fontSize: scale(11), fontWeight: '700' },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EDECEC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: scale(56),
    backgroundColor: '#FFF',
  },
  errorBorder: { borderColor: '#FCA5A5', backgroundColor: '#FFF8F8' },
  input: { flex: 1, paddingHorizontal: 12, fontSize: scale(15), color: '#111', fontWeight: '600' },
  recaptcha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#EDECEC',
    borderRadius: 16,
    marginBottom: scale(20),
    backgroundColor: '#FFF',
    overflow: 'hidden',
    height: scale(62),
  },
  recaptchaLeft: { flexDirection: 'row', alignItems: 'center', paddingLeft: 16, flex: 1 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#DDD',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  checkboxChecked: { backgroundColor: '#000', borderColor: '#000' },
  recaptchaText: { fontSize: scale(13), color: '#666', fontWeight: '600' },
  recaptchaImageContainer: { width: scale(85), height: '100%', backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  recaptchaTitle: { color: '#fff', fontWeight: '900', fontSize: 8, marginTop: 3 },
  recaptchaSmall: { color: '#999', fontSize: 7, fontWeight: '700' },
  generalErrorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 14, borderRadius: 14, marginBottom: 18, borderWidth: 1, borderColor: '#FEE2E2' },
  generalErrorText: { color: '#B91C1C', fontSize: scale(12), fontWeight: '700', marginLeft: 10, flex: 1 },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 14, borderRadius: 14, marginBottom: 18, borderWidth: 1, borderColor: '#DCFCE7' },
  successText: { color: '#166534', fontSize: scale(12), fontWeight: '700', marginLeft: 10, flex: 1 },
  signUpBtn: {
    backgroundColor: '#000', height: scale(58), borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    marginBottom: scale(15), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  signUpText: { color: '#fff', fontWeight: '800', fontSize: scale(16), letterSpacing: 0.5 },
  backToLoginText: { fontSize: scale(14), color: '#666', textAlign: 'center', marginBottom: scale(15) },
  boldLink: { fontWeight: '900', color: '#000', textDecorationLine: 'underline' },
  footer: { fontSize: scale(11), textAlign: 'center', color: '#999', lineHeight: 16, fontWeight: '500', marginTop: scale(50) },
  boldText: { fontWeight: '700', color: '#666' },
});