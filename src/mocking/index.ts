import { createServer } from 'miragejs';
import { LOCALSTORAGE_DUMP_KEY } from '@/constants';
import { GET } from './get';
import { POST } from './post';
import { PATCH } from './patch';
import mockRestaurants from './restaurants.json';

export class MockApiService {
  register() {
    console.log('[miragejs] mock api 활성화');

    if (window.server) {
      window.server.shutdown();
    }

    const server = createServer({
      routes: function () {
        GET(this);
        POST(this);
        PATCH(this);

        this.pretender.handledRequest = (verb) => {
          if (verb !== 'GET') {
            localStorage.setItem(
              LOCALSTORAGE_DUMP_KEY,
              JSON.stringify(server.db.dump())
            );
          }
        };
      },
    });

    const dumpData = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_DUMP_KEY) || '{}'
    );

    const restaurants: Restaurant[] = [];

    mockRestaurants.documents.forEach((document) => {
      restaurants.push({
        id: document.id,
        category: 'pizza',
        name: document.place_name,
        lat: +document.x,
        lng: +document.y,
        placeUrl: document.place_url,
      });
    });

    const defaultData: { '0': RoomInfo } = {
      '0': {
        lat: 33.450701,
        lng: 126.570667,
        endTime: new Date(Date.now() + 1000 * 60 * 60).getTime(),
        radius: 1000,
        restaurants,
        select: {},
        picky: {},
        chats: [],
        user: {},
        capacity: 3,
      },
    };

    server.db.loadData(
      Object.keys(dumpData).length !== 0 ? dumpData : defaultData
    );

    window.server = server;
  }
}
