import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  //const [newAnswer, setNewAnswer] = useState('');

  const fetchUserSession = async () => {
    try {
      const response = await axios.get('/api/account');
      const { loggedIn, username } = response.data;
      setLoggedIn(loggedIn);
      setUsername(username);
    } catch (error) {
      console.error('Error fetching user session:', error);
      alert('Error fetching user session');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      console.log(response.data);
      setQuestions(response.data);
      console.log(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Error fetching questions');
    }
  };

  useEffect(() => {
    fetchUserSession();
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/account/logout');
      setLoggedIn(false);
      setUsername('');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out');
    }
  };

  const handleAddQuestion = async () => {
    try {
      //console.log("new Question", newQuestion)
      await axios.post('http://localhost:8000/api/questions/add', { newQuestion });
      setModalOpen(false);
      setNewQuestion('');
      fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question');
    }
  };

  /*const handleAnswerQuestion = async (questionId: string) => {
    try {
      await axios.post('/api/questions/answer', {
        _id: questionId,
        answer: newAnswer,
      });
      setNewAnswer('');
      fetchQuestions();
    } catch (error) {
      console.error('Error answering question:', error);
      alert('Failed to answer question');
    }
  };*/

  return (
    <div>
      {loggedIn ? (
        <div className="cw-logged-in">
          <h2>Welcome, {username}!</h2>
          <button onClick={handleLogout}>Log Out</button>
          <button onClick={() => setModalOpen(true)}>Add New Question</button>
          {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setModalOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setModalOpen(false);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  &times;
                </span>
                <h3>Add New Question</h3>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter your question"
                />
                <button onClick={handleAddQuestion}>Submit</button>
              </div>
            </div>
          )}
          <h3>Questions</h3>

        </div>
      ) : (
        <div className="cw-logged-out">
          <h2>Home Page</h2>
          <p>Please log in to view questions.</p>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Home;