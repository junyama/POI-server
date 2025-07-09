
#ifndef SwaggerComponent_hpp
#define SwaggerComponent_hpp

#include "oatpp-swagger/Model.hpp"
#include "oatpp-swagger/Resources.hpp"
#include "oatpp/macro/component.hpp"

#include "oatpp/base/Log.hpp"

/**
 *  Swagger ui is served at
 *  http://host:port/swagger/ui
 */
class SwaggerComponent {
private:
  constexpr static const char *TAG = "SwaggerComponent";

  public:
  
  /**
   *  General API docs info
   */
  OATPP_CREATE_COMPONENT(std::shared_ptr<oatpp::swagger::DocumentInfo>, swaggerDocumentInfo)([] {
    
    oatpp::String url = getenv("SERVER_IP");
     if (!url) 
     {
      url = "<IP address>";
      OATPP_LOGd(TAG, "SERVER_IP environment variable not defined");
     }

    oatpp::String portNum = getenv("SERVER_PORT");
    if (!portNum) 
    {
      portNum = "8000";
      OATPP_LOGd(TAG, "SERVER_PORT environment variable not defined");
    }
   
    url = "http://" + url + ":" + portNum;
    
    oatpp::swagger::DocumentInfo::Builder builder;
    
    builder
    .setTitle("User entity service")
    .setDescription("CRUD API Example project with swagger docs")
    .setVersion("1.0")
    .setContactName("Ivan Ovsyanochka")
    .setContactUrl("https://oatpp.io/")
    
    .setLicenseName("Apache License, Version 2.0")
    .setLicenseUrl("http://www.apache.org/licenses/LICENSE-2.0")
    
    .addServer(url, "server on remote host")
    .addServer("http://localhost:8000", "server on localhost");
    
    return builder.build();
    
  }());
  
  
  /**
   *  Swagger-Ui Resources (<oatpp-examples>/lib/oatpp-swagger/res)
   */
  OATPP_CREATE_COMPONENT(std::shared_ptr<oatpp::swagger::Resources>, swaggerResources)([] {
    // Make sure to specify correct full path to oatpp-swagger/res folder !!!
    return oatpp::swagger::Resources::loadResources(OATPP_SWAGGER_RES_PATH);
  }());
  
};

#endif /* SwaggerComponent_hpp */
