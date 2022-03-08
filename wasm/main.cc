#include <cstdio>
#include <emscripten.h>



char inputBuffer[410000];
char outputBuffer[410000];

extern "C" {

EMSCRIPTEN_KEEPALIVE
char* getInputBuffer() {
  return inputBuffer;
}

EMSCRIPTEN_KEEPALIVE
char* getOutputBuffer() {
  return outputBuffer;
}

EMSCRIPTEN_KEEPALIVE
void someFunction() {
  printf("some function \r\n");
}
}//extern "C"