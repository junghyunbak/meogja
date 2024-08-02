import { useEffect } from 'react';
import { MockApiService } from './mocking';
import axios from 'axios';
import { Home } from './pages/Home';

function App() {
  useEffect(() => {
    new MockApiService().register();

    (async () => {
      let userId = localStorage.getItem('userId');

      if (!userId) {
        const {
          data: {
            data: { id },
          },
        } = await axios.post<ResponseTemplate<{ id: string }>>('/api/join');

        userId = id;
      }

      localStorage.setItem('userId', userId);

      await axios.get('/api/chk-user-id', { params: { userId } });
    })();
  }, []);

  return <Home />;
}

export default App;
