import { createServer } from "miragejs";
import { LOCALSTORAGE_DUMP_KEY } from "../constants";
import { GET } from "./get";
import { POST } from "./post";

export class MockApiService {
  register() {
    console.log("[miragejs] mock api 활성화");

    if (window.server) {
      window.server.shutdown();
    }

    const server = createServer({
      routes: function () {
        GET(this);
        POST(this);

        this.pretender.handledRequest = (verb) => {
          if (verb === "POST") {
            localStorage.setItem(
              LOCALSTORAGE_DUMP_KEY,
              JSON.stringify(server.db.dump())
            );
          }
        };
      },
    });

    const dumpData = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_DUMP_KEY) || "{}"
    );

    const defaultData: { room: RoomInfo } = {
      room: {
        lat: 30,
        lng: 30,
        endTime: new Date(Date.now() + 1000 * 60).getTime(),
        radius: 1000,
        restaurants: [],
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
