# memo

## main directory の意味

https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/build-system.html?highlight=rename

### Renaming main Component

The build system provides special treatment to the main component. It is a component that gets automatically added to the build provided that it is in the expected location, PROJECT_DIR/main. All other components in the build are also added as its dependencies, saving the user from hunting down dependencies and providing a build that works right out of the box. Renaming the main component causes the loss of these behind-the-scenes heavy lifting, requiring the user to specify the location of the newly renamed component and manually specifying its dependencies. Specifically, the steps to renaming main are as follows:

Rename main directory.

Set EXTRA_COMPONENT_DIRS in the project CMakeLists.txt to include the renamed main directory.

Specify the dependencies in the renamed component’s CMakeLists.txt file via REQUIRES or PRIV_REQUIRES arguments on component registration.