import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractLectures } from "../src/lectures.js";

test("extracts lessons from the real lectures-data.js", () => {
  const data = extractLectures(readFileSync(new URL("../../lectures-data.js", import.meta.url), "utf8"));
  assert.ok(Array.isArray(data));
  data.forEach((s) => assert.ok(s.lessons.length > 0));
});

test("empty list is valid", () => {
  assert.deepEqual(extractLectures("window.LECTURES = (window.LECTURES || []).concat([]);"), []);
});

test("rejects non-JSON or wrong shape", () => {
  assert.equal(extractLectures("window.LECTURES = (window.LECTURES || []).concat([{ id: 1 }]);"), null);
  assert.equal(extractLectures('window.LECTURES = (window.LECTURES || []).concat([{"id":1}]);'), null);
  assert.equal(extractLectures("<html>404</html>"), null);
});
