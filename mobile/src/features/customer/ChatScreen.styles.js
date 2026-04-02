import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingTop: 55,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  engineerName: { fontWeight: 'bold', fontSize: 16 },
  engineerStatus: { fontSize: 12, color: 'green' },

  /* CHAT LIST */
  chatList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: width * 0.7,
    padding: 10,
    marginVertical: 4,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerMessage: {
    backgroundColor: '#1F1F1F',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  engineerMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: { color: '#fff', fontSize: 14 },
  messageTime: { fontSize: 10, color: '#ccc', alignSelf: 'flex-end', marginTop: 2 },

  /* INPUT BAR */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: '#f1f1f1',
  },
  sendBtn: {
    backgroundColor: '#1F1F1F',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});