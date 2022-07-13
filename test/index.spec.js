import { mount } from "@vue/test-utils";
import index from "@/pages/index";

describe("Index Page", () => {
  test("is Vue instance", () => {
    const app = mount(index, {
      props: {
        isActive: false,
        fetchURL: "https://apis.deutschebahn.com/db-api-marketplace/apis/fahrplan/v1/location/",
      },
    });
    expect(app.vm).toBeTruthy();
  });
});
