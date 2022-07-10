import { mount } from "@vue/test-utils";
import index from "@/pages/index";

describe("Index Page", () => {
  test("is Vue instance", () => {
    const app = mount(index);
    expect(app.vm).toBeTruthy();
  });
});
