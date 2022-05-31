
import{initializeApp} from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebaseConfig'
const app = initializeApp(firebaseConfig)
const db= getFirestore(app)
//app.config.globalProperties.$db = db;
export{db}