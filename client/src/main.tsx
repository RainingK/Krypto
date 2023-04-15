import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css';
import { TransactionProvider } from './context/TransactionContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TransactionProvider>
		<App />
  </TransactionProvider>
)
