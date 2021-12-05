import { assert } from "https://deno.land/std/testing/asserts.ts";

Deno.test({
  name: "Checking deno version",
  fn(): void {
    const version: any = Deno.env.get("DENO_VERSION");
    assert(parseInt(version) >= 1);
  }
})
