import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  avatar: { width: 40, height: 40, borderRadius: 12, marginRight: 10, backgroundColor: '#EEE' },
  userName: { fontSize: 16, fontWeight: '800', color: '#111' },
  statusText: { fontSize: 11, color: '#16A34A', fontWeight: '700' }, 
  callIcon: { padding: 8, backgroundColor: '#F9F9F9', borderRadius: 20 },

  listPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  
  msgWrapper: { marginBottom: 15, maxWidth: '85%' },
  msgLeft: { alignSelf: 'flex-start' },
  msgRight: { alignSelf: 'flex-end' },
  bubble: { padding: 14, borderRadius: 20 },
  customerBubble: { backgroundColor: '#111', borderBottomRightRadius: 4 },
  engineerBubble: { backgroundColor: '#F2F2F2', borderBottomLeftRadius: 4 },
  textWhite: { color: '#FFF', fontSize: 15 },
  textBlack: { color: '#111', fontSize: 15 },
  timeText: { fontSize: 10, color: '#AAA', marginTop: 4 },

  /* THE FIX: Standardized Input Area */
  inputArea: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  /* This specific padding replaces the Spacer and prevents the "jump" */
  inputAreaWithNav: {
    paddingBottom: Platform.OS === 'android' ? 120 : 90, 
  },
  searchStyleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: Platform.OS === 'android' ? 10 : 0,
  },
});