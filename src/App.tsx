import { useEffect } from 'react';
import Logo from '@/assets/svgs/Logo.svg?react';
import './App.css';

import { MockApiService } from './mocking';
import axios from 'axios';

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

  return (
    <div className="flex flex-col items-center gap-8">
      <Logo className="text-bg" />
      <p>
        함께하고 싶은 <span className="font-bold text-primary">식당</span>을
        다같이 골라보세요.
      </p>
      <div className="flex w-full items-center justify-center rounded bg-primary py-2 text-white">
        시작하기
      </div>
    </div>
  );
}

export default App;
