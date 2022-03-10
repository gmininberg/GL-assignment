# building the wasm and js files.

## install bazel:
### macOS:
our macOS should have everything installed (comes with xcode) so no pre requirements are needed.
https://docs.bazel.build/versions/main/install-os-x.html#step-2-download-the-bazel-installer \
use bazel version: 4.2.1

### ubuntu:
need to make sure all pre requriments are met:
```
apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        gcc-8 g++-8 \
        ca-certificates \
        curl \
        ffmpeg \
        git \
        wget \
        unzip \
        python3-dev \
        python3-opencv \
        python3-pip \
        libopencv-core-dev \
        libopencv-highgui-dev \
        libopencv-imgproc-dev \
        libopencv-video-dev \
        libopencv-calib3d-dev \
        libopencv-features2d-dev \
        software-properties-common && \
    add-apt-repository -y ppa:openjdk-r/ppa && \
    apt-get update && apt-get install -y openjdk-8-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-8 100 --slave /usr/bin/g++ g++ /usr/bin/g++-8
pip3 install --upgrade setuptools
pip3 install wheel
pip3 install future
pip3 install six==1.14.0
pip3 install tensorflow==1.14.0
pip3 install tf_slim

ln -s /usr/bin/python3 /usr/bin/python
```

then install bazel:
```
mkdir /bazel && \
    wget --no-check-certificate -O /bazel/installer.sh "https://github.com/bazelbuild/bazel/releases/download/${BAZEL_VERSION}/b\
azel-${BAZEL_VERSION}-installer-linux-x86_64.sh" && \
    wget --no-check-certificate -O  /bazel/LICENSE.txt "https://raw.githubusercontent.com/bazelbuild/bazel/master/LICENSE" && \
    chmod +x /bazel/installer.sh && \
    /bazel/installer.sh  && \
    rm -f /bazel/installer.sh
```

## build opencv (if we see its needed)
need to clone emsdk since open CV not supports out of the box bazel build.
need to make sure we use the same emsdk version as we use for build tflite (for now its 2.0.31)
```
git clone https://github.com/emscripten-core/emsdk.git emsdk
cd emsdk
python2.7 ./emsdk.py update
python2.7 ./emsdk.py install 2.0.31
python2.7 ./emsdk.py activate 2.0.31
```

need to clone openCV and adjust it to work with 2.0.31 (openCV is set on 2.0.10 which is not released version)
for `make install` make sure that in `cmake_install.cmake` this code is set `set(CMAKE_INSTALL_PREFIX "/Users/guymininberg/container/media-processor/video-transformers/opencv/build_wasm_simd/install")`
```
git clone https://github.com/opencv/opencv.git opencv
cd opencv
git checkout  4.5.5
git apply ../vonage_opencv_emscriptan_2.0.31.patch
python3  platforms/js/build_js.py build_wasm_simd --emscripten_dir=../emsdk/upstream/emscripten --config_only --simd
cd build_wasm_simd
../../emsdk/upstream/emscripten/emmake make -j 4
../../emsdk/upstream/emscripten/emmake make install 
```


## building the code:
```
bazel build :simd-wasm --copt='-msimd128'
```

## extra reading:
- https://github.com/google/mediapipe/blob/master/Dockerfile - ubuntu configuration.
- https://github.com/emscripten-core/emsdk/tree/main/bazel - building wasm and js files.
- https://docs.opencv.org/4.x/d4/da1/tutorial_js_setup.html - useful information about building JS and wasm.
- https://github.com/w-okada/image-analyze-workers - examples.
- https://emscripten.org/docs/porting/multimedia_and_graphics/OpenGL-support.html - support for openGL in emscripten
- https://www.w3.org/TR/webcodecs/#dom-videoframe-copyto - get video frame buffer in low CPU
