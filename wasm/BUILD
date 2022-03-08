# Description:

load("@rules_cc//cc:defs.bzl", "cc_binary")
load("@emsdk//emscripten_toolchain:wasm_rules.bzl", "wasm_cc_binary")

cc_library(
    name = "transformer",
    srcs = ["main.cc"],
    deps = [
  ],
  alwayslink = 1,
)

cc_binary(
  name = "simd",
  linkopts = [
    "-s ENVIRONMENT='web'",
    "-s ALLOW_MEMORY_GROWTH=1",
    "-s USE_PTHREADS=0",
    "-s MODULARIZE=1",
    "-s EXPORT_NAME=SimdModule",
    "-O3",
  ],
  deps = [
    ":transformer"
  ],
)

# wasm simd
wasm_cc_binary(
    name = "simd-wasm",
    cc_target = ":simd",
    simd = True,
    threads = "off",
)
