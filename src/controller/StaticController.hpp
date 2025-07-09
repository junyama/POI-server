
#ifndef CRUD_STATICCONTROLLER_HPP
#define CRUD_STATICCONTROLLER_HPP

#define PROJECT_ROOT "/home/junichi/github/POI-server/"
#define WWW_PATH "www/"

#include "oatpp/web/server/api/ApiController.hpp"
#include "oatpp/json/ObjectMapper.hpp"
#include "oatpp/macro/codegen.hpp"
#include "oatpp/macro/component.hpp"
#include "oatpp/web/protocol/http/outgoing/StreamingBody.hpp"

#include OATPP_CODEGEN_BEGIN(ApiController) //<- Begin Codegen

class StaticController : public oatpp::web::server::api::ApiController
{
private:
  constexpr static const char *TAG = "StaticController";
  std::string projectRoot = PROJECT_ROOT;
  std::string filePath;

public:
  StaticController(const std::shared_ptr<oatpp::web::mime::ContentMappers> &apiContentMappers)
      : oatpp::web::server::api::ApiController(apiContentMappers)
  {
  }

public:
  static std::shared_ptr<StaticController> createShared(
      OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers) // Inject ContentMappers
  )
  {
    return std::make_shared<StaticController>(apiContentMappers);
  }

  ENDPOINT("GET", "/", root)
  {
    filePath = projectRoot + WWW_PATH + "index.html";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/html");
    return response;
  }

  ENDPOINT("GET", "/favicon.ico", favicon)
  {
    filePath = projectRoot + WWW_PATH + "favicon.ico";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "image/x-icon");
    return response;
  }

  ENDPOINT("GET", "/style.css", styleCss)
  {
    filePath = projectRoot + WWW_PATH + "style.css";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/css");
    return response;
  }

  ENDPOINT("GET", "/image-db.css", imageDbCss)
  {
    filePath = projectRoot + WWW_PATH + "image-db.css";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/css");
    return response;
  }

  ENDPOINT("GET", "/functions.js", functionsJs)
  {
    filePath = projectRoot + WWW_PATH + "functions.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }

  ENDPOINT("GET", "/image-db.js", imageDbJs)
  {
    filePath = projectRoot + WWW_PATH + "image-db.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }

  ENDPOINT("GET", "/calc.js", predictJs)
  {
    filePath = projectRoot + WWW_PATH + "calc.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }

  ENDPOINT("GET", "/fileworkers.js", fileworkersJs)
  {
    filePath = projectRoot + WWW_PATH + "fileworkers.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }

  ENDPOINT("GET", "/magnifier.js", magnifier)
  {
    filePath = projectRoot + WWW_PATH + "magnifier.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }

  /*
  ENDPOINT("GET", "/", root) {
    const char* html =
      "<html lang='en'>"
      "  <head>"
      "    <meta charset=utf-8/>"
      "  </head>"
      "  <body>"
      "    <p>Hello CRUD example project!</p>"
      "    <a href='swagger/ui'>Checkout Swagger-UI page</a>"
      "  </body>"
      "</html>";
    auto response = createResponse(Status::CODE_200, html);
    response->putHeader(Header::CONTENT_TYPE, "text/html");
    return response;
  }
  */
};

#include OATPP_CODEGEN_END(ApiController) //<- End Codegen

#endif // CRUD_STATICCONTROLLER_HPP
