import { expect } from "chai";
import supertest from "supertest";
import { app } from "../app";
import nock from "nock";
import { userFixture } from "./fixtures";

nock.disableNetConnect();
nock.enableNetConnect("127.0.0.1");

const scope = nock("http://jsonplaceholder.typicode.com");

const server = app.listen();
const request = supertest(server);

describe("UsersController", () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  after(() => {
    server.close();
  });
  describe("GET /users/:id", () => {
    it("должен запросить пользователя из настоящего бекенда и вернуть только нужные поля", async () => {
      scope.get("/users/1").reply(200, userFixture);

      const result = await request.get("/users/1");

      expect(result.body).to.eql({
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
      });
    });

    const specs = [
      {
        inputCode: 400,
        expectedCode: 400,
      },
      {
        inputCode: 500,
        expectedCode: 500,
      },
    ].forEach((spec) =>
      it(`должен ответить ${spec.expectedCode} кодом, если апи ответило ${spec.inputCode} кодом`, async () => {
        scope
          .get("/users/1")
          .reply(spec.inputCode, { code: "CODE", message: "message" });

        const result = await request.get("/users/1");

        expect(result.status).to.eql(spec.expectedCode);
        expect(result.body).to.eql({
          code: "CODE",
          message: "message",
        });
      })
    );

    it("должен вернуть только id и name, если запрос пришел с параметром isShort=true", async () => {
      scope.get("/users/1").reply(200, userFixture);

      const result = await request.get("/users/1?isShort=true");

      expect(result.body).to.eql({
        id: 1,
        name: "Leanne Graham",
      });
    });

    it("должен вернуть все данные, если запрос пришел с параметром isShort=false", async () => {
      scope.get("/users/1").reply(200, userFixture);

      const result = await request.get("/users/1?isShort=false");

      expect(result.body).to.eql({
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
      });
    });

    it("должен вернуть 400 ошибку, если запрос пришел с параметром isShort=lolkek", async () => {
      scope.get("/users/1").reply(200, userFixture);

      const result = await request.get("/users/1?isShort=lolkek");

      expect(result.status).to.eql(400);
      expect(result.body).to.eql({
        code: "isShortIsNotBoolean",
        message: "isShort должен быть булевым значением",
      });
    });
  });

  describe("GET /users", () => {
    it("должен вернуть список пользователей с малым набором данных, если данные запрошены с isShort=true", async () => {
      scope.get("/users").reply(200, [userFixture, userFixture]);

      const result = await request.get("/users?isShort=true");

      expect(result.status).to.eql(200);
      expect(result.body).to.eql([
        {
          id: 1,
          name: "Leanne Graham",
        },
        {
          id: 1,
          name: "Leanne Graham",
        },
      ]);
    });
  });
});
