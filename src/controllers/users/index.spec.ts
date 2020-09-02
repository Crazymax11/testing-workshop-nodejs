import Koa from "koa";
import supertest from "supertest";
import { userRoutes } from ".";
import { expect } from "chai";
import nock from "nock";
import { userFixture } from "./fixture";

nock.disableNetConnect();
nock.enableNetConnect("127.0.0.1");

const scope = nock("http://jsonplaceholder.typicode.com:80/");

const app = new Koa();
app.use(userRoutes);
const server = app.listen();
const request = supertest(server);

// ЧТО МЫ ТЕСТИРУЕМ
describe("usersController", () => {
  describe("GET /:id", () => {
    // ЧТО МЫ ОЖИДАЕМ
    it("должен замапить результаты из API", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1");
      expect(status).to.eq(200);
      expect(body).to.deep.eq({
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
      });
    });

    const errorSpecs = [
      {
        apiResposeCode: 400,
        expectedResponseCode: 400,
      },
      {
        apiResposeCode: 500,
        expectedResponseCode: 500,
      },
    ].forEach((spec) =>
      // ЧТО ОЖИДАЕМ
      // В КАКОМ КОНТЕКСТЕ
      it(`должен проксировать ${spec.apiResposeCode} ошибку от АПИ`, async () => {
        scope.get("/users/1").reply(spec.apiResposeCode, { code: "CODE" });
        const { status, body } = await request.get("/users/1");
        expect(status).to.eq(spec.expectedResponseCode);
        expect(body).to.deep.eq({
          code: "CODE",
        });
      })
    );

    it("должен вернуть только id и name если isShort = true", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1?isShort=true");
      expect(status).to.eq(200);
      expect(body).to.deep.eq({
        id: 1,
        name: "Leanne Graham",
      });
    });
    it("должен вернуть все данные если isShort = false", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1?isShort=false");
      expect(status).to.eq(200);
      expect(body).to.deep.eq({
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
      });
    });
    // ЧТО ОЖИДАЕМ В КАКОМ КОНТЕКСТЕ
    it("должен вернуть 400 если isShort не boolean", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1?isShort=kek");
      expect(status).to.eq(400);
      expect(body).to.deep.eq({
        code: "IS_SHORT_MUST_BE_BOOL",
      });
    });
  });

  describe("GET /users", () => {
    it("должен замапить результаты из API", async () => {
      // AAA

      // Given
      // When
      // Then

      // arrange
      scope.get("/users").reply(200, [userFixture]);

      // act
      const { status, body } = await request.get("/users");

      // assert
      expect(status).to.eq(200);
      expect(body).to.deep.eq([
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
        },
      ]);
    });
  });
  beforeEach(() => {
    // cleanUp
    nock.cleanAll();
  });
  after(() => {
    server.close();
  });
});
