import React, { useState, useEffect, useRef } from 'react';

const API_KEY = 'çalıştırmak için buraya api key girin';
const BACKEND_URL = 'https://localhost:7242';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Query Bill için geçici state
  const [queryBillStep, setQueryBillStep] = useState(null); // null | 'SubscriberNo' | 'Month' | 'Year' | 'done'
  const [queryBillData, setQueryBillData] = useState({ SubscriberNo: '', Month: '', Year: '' });
  const [queryBillDetailedStep, setQueryBillDetailedStep] = useState(null); // null | 'SubscriberNo' | 'Month' | 'Year' | 'done'
  const [queryBillDetailedData, setQueryBillDetailedData] = useState({ SubscriberNo: '', Month: '', Year: '' });
  const [payBillStep, setPayBillStep] = useState(null); // null | 'SubscriberNo' | 'Month' | 'Year' | 'PaymentAmount' | 'done'
  const [payBillData, setPayBillData] = useState({ SubscriberNo: '', Month: '', Year: '', PaymentAmount: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (customInput) => {
    const messageToSend = customInput !== undefined ? customInput : input;
    if (!messageToSend.trim()) return;
    const userMessage = { role: 'user', content: messageToSend };
    let newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Query Bill adım adım
    if (queryBillStep) {
      let nextStep = null;
      let newData = { ...queryBillData };
      if (queryBillStep === 'SubscriberNo') {
        newData.SubscriberNo = messageToSend.trim();
        nextStep = 'Month';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the month (1-12):' }]);
        setQueryBillData(newData);
        setQueryBillStep(nextStep);
        setLoading(false);
        return;
      } else if (queryBillStep === 'Month') {
        newData.Month = messageToSend.trim();
        nextStep = 'Year';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the year (e.g., 2024):' }]);
        setQueryBillData(newData);
        setQueryBillStep(nextStep);
        setLoading(false);
        return;
      } else if (queryBillStep === 'Year') {
        newData.Year = messageToSend.trim();
        nextStep = 'done';
        setQueryBillData(newData);
        setQueryBillStep(nextStep);
        // Eğer tüm bilgiler tamamlandıysa API'ye istek at
        try {
          const params = new URLSearchParams(newData).toString();
          const res = await fetch(`${BACKEND_URL}/api/Bill/QueryBill?${params}`);
          const data = await res.json();
          setMessages([...newMessages, { role: 'assistant', content: JSON.stringify(data, null, 2) }]);
        } catch (e) {
          setMessages([...newMessages, { role: 'assistant', content: 'An error occurred while querying the bill.' }]);
        }
        setQueryBillStep(null);
        setQueryBillData({ SubscriberNo: '', Month: '', Year: '' });
        setLoading(false);
        return;
      }
    }

    // Query Bill Detailed adım adım
    if (queryBillDetailedStep) {
      let nextStep = null;
      let newData = { ...queryBillDetailedData };
      if (queryBillDetailedStep === 'SubscriberNo') {
        newData.SubscriberNo = messageToSend.trim();
        nextStep = 'Month';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the month (1-12):' }]);
        setQueryBillDetailedData(newData);
        setQueryBillDetailedStep(nextStep);
        setLoading(false);
        return;
      } else if (queryBillDetailedStep === 'Month') {
        newData.Month = messageToSend.trim();
        nextStep = 'Year';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the year (e.g., 2024):' }]);
        setQueryBillDetailedData(newData);
        setQueryBillDetailedStep(nextStep);
        setLoading(false);
        return;
      } else if (queryBillDetailedStep === 'Year') {
        newData.Year = messageToSend.trim();
        nextStep = 'done';
        setQueryBillDetailedData(newData);
        setQueryBillDetailedStep(nextStep);
        // Eğer tüm bilgiler tamamlandıysa API'ye istek at
        try {
          const params = new URLSearchParams(newData).toString();
          const res = await fetch(`${BACKEND_URL}/api/Bill/QueryBillDetailed?${params}`);
          const data = await res.json();
          setMessages([...newMessages, { role: 'assistant', content: JSON.stringify(data, null, 2) }]);
        } catch (e) {
          setMessages([...newMessages, { role: 'assistant', content: 'An error occurred while querying the detailed bill.' }]);
        }
        setQueryBillDetailedStep(null);
        setQueryBillDetailedData({ SubscriberNo: '', Month: '', Year: '' });
        setLoading(false);
        return;
      }
    }

    // Pay Bill adım adım
    if (payBillStep) {
      let nextStep = null;
      let newData = { ...payBillData };
      if (payBillStep === 'SubscriberNo') {
        newData.SubscriberNo = messageToSend.trim();
        nextStep = 'Month';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the month (1-12):' }]);
        setPayBillData(newData);
        setPayBillStep(nextStep);
        setLoading(false);
        return;
      } else if (payBillStep === 'Month') {
        newData.Month = messageToSend.trim();
        nextStep = 'Year';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the year (e.g., 2024):' }]);
        setPayBillData(newData);
        setPayBillStep(nextStep);
        setLoading(false);
        return;
      } else if (payBillStep === 'Year') {
        newData.Year = messageToSend.trim();
        nextStep = 'PaymentAmount';
        setMessages([...newMessages, { role: 'assistant', content: 'Please enter the payment amount:' }]);
        setPayBillData(newData);
        setPayBillStep(nextStep);
        setLoading(false);
        return;
      } else if (payBillStep === 'PaymentAmount') {
        newData.PaymentAmount = messageToSend.trim();
        nextStep = 'done';
        setPayBillData(newData);
        setPayBillStep(nextStep);
        // Eğer tüm bilgiler tamamlandıysa API'ye istek at
        try {
          const params = new URLSearchParams(newData).toString();
          const res = await fetch(`${BACKEND_URL}/api/Bill/PayBill?${params}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData)
          });
          const data = await res.json();
          setMessages([...newMessages, { role: 'assistant', content: JSON.stringify(data, null, 2) }]);
        } catch (e) {
          setMessages([...newMessages, { role: 'assistant', content: 'An error occurred while paying the bill.' }]);
        }
        setPayBillStep(null);
        setPayBillData({ SubscriberNo: '', Month: '', Year: '', PaymentAmount: '' });
        setLoading(false);
        return;
      }
    }

    // Komutları kontrol et
    const lowerInput = messageToSend.trim().toLowerCase();
    if (lowerInput === 'query bill') {
      setQueryBillStep('SubscriberNo');
      setQueryBillData({ SubscriberNo: '', Month: '', Year: '' });
      setMessages([...newMessages, { role: 'assistant', content: 'Please enter the subscriber number:' }]);
      setLoading(false);
      return;
    }
    if (lowerInput === 'query bill detailed') {
      setQueryBillDetailedStep('SubscriberNo');
      setQueryBillDetailedData({ SubscriberNo: '', Month: '', Year: '' });
      setMessages([...newMessages, { role: 'assistant', content: 'Please enter the subscriber number:' }]);
      setLoading(false);
      return;
    }
    if (lowerInput === 'pay bill') {
      setPayBillStep('SubscriberNo');
      setPayBillData({ SubscriberNo: '', Month: '', Year: '', PaymentAmount: '' });
      setMessages([...newMessages, { role: 'assistant', content: 'Please enter the subscriber number:' }]);
      setLoading(false);
      return;
    }

    // Diğer mesajlar için ChatGPT API
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Bir hata oluştu.';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Bir hata oluştu.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ background: '#f4f6fb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#1976d2', marginBottom: 16 }}>Bill Agent</h1>
      <div style={{ width: 400, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? '#1976d2' : '#e3eafc', color: msg.role === 'user' ? '#fff' : '#222', borderRadius: 16, padding: '8px 16px', maxWidth: '80%' }}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => sendMessage('query bill')}
            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 16, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
          >
            Query Bill
          </button>
          <button
            onClick={() => sendMessage('query bill detailed')}
            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 16, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
          >
            Query Bill Detailed
          </button>
          <button
            onClick={() => sendMessage('pay bill')}
            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 16, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
          >
            Pay Bill
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            style={{ flex: 1, borderRadius: 16, border: '1px solid #ccc', padding: '8px 12px', outline: 'none' }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 16, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}
            disabled={loading}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default App; 