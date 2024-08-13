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
            localStorage.setItem(LOCALSTORAGE_DUMP_KEY, JSON.stringify(server.db.dump()));
          }
        };
      },
    });

    const dumpData = JSON.parse(localStorage.getItem(LOCALSTORAGE_DUMP_KEY) || '{}');

    const restaurants: Restaurant[] = [];

    mockRestaurants.documents.forEach((document) => {
      restaurants.push({
        id: document.id,
        name: document.place_name,
        lat: +document.y,
        lng: +document.x,
        placeUrl: document.place_url,
        categoryName: document.category_group_name,
      });
    });

    const defaultData: { '0': RoomInfo } = {
      '0': {
        lat: 33.450701,
        lng: 126.570667,
        endTime: new Date(Date.now() + 1000 * 60 * 60).getTime(),
        radius: 1,
        restaurants,
        user: {},
        capacity: 3,
        maxPickCount: 3,
        category: 'FD6',
      },
    };

    server.db.loadData(Object.keys(dumpData).length !== 0 ? dumpData : defaultData);

    window.server = server;
  }
}
