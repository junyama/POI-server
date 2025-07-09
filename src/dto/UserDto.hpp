#ifndef UserDto_hpp
#define UserDto_hpp

#include "oatpp/macro/codegen.hpp"
#include "oatpp/Types.hpp"

#include OATPP_CODEGEN_BEGIN(DTO)

ENUM(Category, v_int32,
     VALUE(TRAVEL, 0, "CAT_TRAVEL"),
     VALUE(CAR, 1, "CAT_CAR"),
     VALUE(THEATER, 2, "CAT_THEATER"),
     VALUE(BUSINESS, 4, "CAT_BUSINESS"),
     VALUE(TEMPLE, 5, "CAT_TEMPLE"),
     VALUE(MUSEUM, 6, "CAT_MUSEUM"),
     VALUE(HOTEL, 7, "CAT_HOTEL"),
     VALUE(HOSPITAL, 8, "CAT_HOSPITAL"),
     VALUE(GOVERMENT, 9, "CAT_GOVERMENT"),
     VALUE(RESTAURANT, 10, "CAT_RESTAURANT"),
     VALUE(OTHERS, 11, "CAT_OTHERS"))

class UserDto : public oatpp::DTO
{

  DTO_INIT(UserDto, DTO)

  DTO_FIELD(Int32, id);
  DTO_FIELD(String, poiName, "poi_name");
  DTO_FIELD(String, latitude, "latitude");
  DTO_FIELD(String, longtitude, "longtitude");
  DTO_FIELD(String, address1, "address1");
  DTO_FIELD(String, address2, "address2");
  DTO_FIELD(String, address3, "address3");
  DTO_FIELD(String, zip, "zip");
  DTO_FIELD(Enum<Category>::AsString, category, "category");
  DTO_FIELD(UInt8, iconId, "icon_id");
  DTO_FIELD(UInt8, poiFile, "poi_file");
  DTO_FIELD(String, regTime, "reg_time");
  DTO_FIELD(String, gpx, "gpx");
};

#include OATPP_CODEGEN_END(DTO)

#endif /* UserDto_hpp */
