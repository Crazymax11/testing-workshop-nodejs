import supertest from "supertest";
import Koa from "koa";
import { routes } from ".";
import { expect } from "chai";
import nock from "nock";
import { userFixture } from "./fixtures";

const scope = nock("http://jsonplaceholder.typicode.com/");

nock.disableNetConnect();
nock.enableNetConnect("127.0.0.1");

const app = new Koa();

app.use(routes);
const server = app.listen();
const request = supertest(server);

describe("app", () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  describe("/GET /users/:id", () => {
    it("should", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1");
      expect(status).to.equal(200);
      expect(body).to.deep.equal({
        email: "Sincere@april.biz",
        id: 1,
        name: "Leanne Graham",
        phone: "1-770-736-8031 x56442",
        username: "Bret",
        website: "hildegard.org",
      });
    });
    it("должен запроксировать 400 ответ", async () => {
      scope.get("/users/1").reply(400, { data: "error" });
      const { status, body } = await request.get("/users/1");
      expect(status).to.equal(400);
      expect(body).to.deep.equal({
        data: "error",
      });
    });

    it("должен отдать короткий список данных, если short = true", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1?short=true");
      expect(status).to.equal(200);
      expect(body).to.deep.equal({
        email: "Sincere@april.biz",
        id: 1,
        name: "Leanne Graham",
      });
    });

    it("должен отдать полный список данных, если short = false", async () => {
      scope.get("/users/1").reply(200, userFixture);
      const { status, body } = await request.get("/users/1?short=false");
      expect(status).to.equal(200);
      expect(body).to.deep.equal({
        email: "Sincere@april.biz",
        id: 1,
        name: "Leanne Graham",
        phone: "1-770-736-8031 x56442",
        username: "Bret",
        website: "hildegard.org",
      });
    });

    it("должен вернуть 400, если short - дичь", async () => {
      const { status, body } = await request.get("/users/1?short=kek");
      expect(status).to.equal(400);
      expect(body).to.deep.equal({
        message: "short должен быть либо true либо false",
      });
    });
  });

  describe("GET /users", () => {
    it("should", async () => {
      scope.get("/users").reply(200, [userFixture, userFixture]);
      const { status, body } = await request.get("/users");
      expect(status).to.equal(200);
      expect(body).to.deep.equal([
        {
          email: "Sincere@april.biz",
          id: 1,
          name: "Leanne Graham",
          phone: "1-770-736-8031 x56442",
          username: "Bret",
          website: "hildegard.org",
        },
        {
          email: "Sincere@april.biz",
          id: 1,
          name: "Leanne Graham",
          phone: "1-770-736-8031 x56442",
          username: "Bret",
          website: "hildegard.org",
        },
      ]);
    });
    it("должен запроксировать 400 ответ", async () => {
      scope.get("/users").reply(400, { data: "error" });
      const { status, body } = await request.get("/users");
      expect(status).to.equal(400);
      expect(body).to.deep.equal({
        data: "error",
      });
    });

    it("должен отдать короткий список данных, если short = true", async () => {
      scope.get("/users").reply(200, [userFixture, userFixture]);
      const { status, body } = await request.get("/users?short=true");
      expect(status).to.equal(200);
      expect(body).to.deep.equal([
        {
          email: "Sincere@april.biz",
          id: 1,
          name: "Leanne Graham",
        },
        {
          email: "Sincere@april.biz",
          id: 1,
          name: "Leanne Graham",
        },
      ]);
    });

    it("должен отдать полный список данных, если short = false", async () => {
      scope.get("/users").reply(200, [userFixture, userFixture]);
      const { status, body } = await request.get("/users?short=false");
      expect(status).to.equal(200);
      expect(body).to.deep.equal([
        {
          email: "Sincere@april.biz",
          id: 1,
          name: "Leanne Graham",
          phone: "1-770-736-8031 x56442",
          username: "Bret",
          website: "hildegard.org",
        },
        {
          email: "Sincere@april.biz",
          id: 1,
          name: "Leanne Graham",
          phone: "1-770-736-8031 x56442",
          username: "Bret",
          website: "hildegard.org",
        },
      ]);
    });

    it("должен вернуть 400, если short - дичь", async () => {
      const { status, body } = await request.get("/users?short=kek");
      expect(status).to.equal(400);
      expect(body).to.deep.equal({
        message: "short должен быть либо true либо false",
      });
    });
  });

  after(() => {
    nock.restore();
    server.close();
  });
});
