file(GLOB MYSRCS src/*.c src/*.cpp)
idf_component_register(SRCS ${MYSRCS} INCLUDE_DIRS "src" REQUIRES arduino)