
#ifndef CRUD_USERDB_HPP
#define CRUD_USERDB_HPP

#include "dto/UserDto.hpp"
#include "oatpp-sqlite/orm.hpp"

#include "oatpp/base/Log.hpp"

#include OATPP_CODEGEN_BEGIN(DbClient) //<- Begin Codegen

/**
 * UserDb client definitions.
 */
class UserDb : public oatpp::orm::DbClient
{
public:
      UserDb(const std::shared_ptr<oatpp::orm::Executor> &executor)
          : oatpp::orm::DbClient(executor)
      {

            oatpp::orm::SchemaMigration migration(executor);
            migration.addFile(1 /* start from version 1 */, DATABASE_MIGRATIONS "/001_init.sql");
            // TODO - Add more migrations here.
            migration.migrate(); // <-- run migrations. This guy will throw on error.

            auto version = executor->getSchemaVersion();
            OATPP_LOGd("UserDb", "Migration - OK. Version={}.", version);
      }

      QUERY(createUser,
            "INSERT INTO AppUser"
            "(poi_name, latitude, longtitude, address1, address2, address3, zip, category, icon_id, poi_file, reg_time, gpx) VALUES "
            "(:user.poi_name, :user.latitude, :user.longtitude, :user.address1, :user.address2, :user.address3, :user.zip, :user.category, :user.icon_id, :user.poi_file, :user.reg_time, :user.gpx);",
            PARAM(oatpp::Object<UserDto>, user))

      QUERY(updateUser,
            "UPDATE AppUser "
            "SET "
            " poi_name=:user.poi_name, "
            " latitude=:user.latitude, "
            " longtitude=:user.longtitude, "
            " address1=:user.address1, "
            " address2=:user.address2, "
            " address3=:user.address3, "
            " zip=:user.zip, "
            " category=:user.category, "
            " icon_id=:user.icon_id, "
            " poi_file=:user.poi_file, "
            " reg_time=:user.reg_time, "
            " gpx=:user.gpx "
            "WHERE "
            " id=:user.id;",
            PARAM(oatpp::Object<UserDto>, user))

      QUERY(getUserById,
            "SELECT * FROM AppUser WHERE id=:id;",
            PARAM(oatpp::Int32, id))

      QUERY(getAllUsers,
            "SELECT * FROM AppUser LIMIT :limit OFFSET :offset;",
            PARAM(oatpp::UInt32, offset),
            PARAM(oatpp::UInt32, limit))

      QUERY(deleteUserById,
            "DELETE FROM AppUser WHERE id=:id;",
            PARAM(oatpp::Int32, id))
};

#include OATPP_CODEGEN_END(DbClient) //<- End Codegen

#endif // CRUD_USERDB_HPP
