window.Usergrid = window.Usergrid || {};
Usergrid.console = Usergrid.console || {};
Usergrid.console.ui = Usergrid.console.ui || { };
Usergrid.console.ui.collections = Usergrid.console.ui.collections || { };

(function($) {
  //This code block *WILL NOT* load before the document is complete

  // Simplified vcard in JSON Schema for demonstration purposes
  // Every collection will have a JSON Schema available and downloadable from the server
  // Empty collections will have a minimal schema that only contains the basic required entity properties
  // Developers will be able to upload schemas to collections as well
  var vcard_schema = {
    "description": __("A representation of a person, company, organization, or place"),
    "type":"object",
    "properties":{
      "username":{
        "type":"string",
        "optional": true,
        "title" : __("Username")
      },
      "name":{
        "description": __("Formatted Name"),
        "type":"string",
        "optional":true,
        "title" : __("Full Name")
      },
      "title":{
        "description": __("User Title"),
        "type":"string",
        "optional": true,
        "title": __("Title")
      },
      "url":{
        "type":"string",
        "format":"url",
        "optional":true,
        "title" : __("Home Page")
      },
      "email":{
        "type":"string",
        "format":"email",
        "optional":true,
        "title" : __("Email")
      },
      "tel":{
        "type":"string",
        "format":"phone",
        "optional":true,
        "title" : __("Telephone")
      },
      "picture":{
        "type":"string",
        "format":"image",
        "optional":true,
        "title" : __("Picture URL")
      },
      "bday":{
        "type":"string",
        "format":"date",
        "optional":true,
        "title" : __("Birthday")
      },
      "adr":{
        "type":"object",
        "properties":{
          "id":{
            "type":"integer"
          },
          "addr1":{
            "type":"string",
            "title" : __("Street 1")
          },
          "addr2":{
            "type":"string",
            "title" : __("Street 2")
          },
          "city":{
            "type":"string",
            "title" : __("City")
          },
          "state":{
            "type":"string",
            "title" : __("State")
          },
          "zip":{
            "type":"string",
            "title" : __("Zip")
          },
          "country":{
            "type":"string",
            "title" : __("Country")
          }
        },
        "optional":true,
        "title" : __("Address")
      }
    }
  };
  Usergrid.console.ui.collections.vcard_schema = vcard_schema;

  var group_schema = {
    "description": __("A representation of a group"),
    "type":"object",
    "properties":{
      "path":{
        "type":"string",
        "optional": true,
        "title" : __("Group Path")
      },
      "title":{
        "type":"string",
        "optional":true,
        "title" : __("Display Name")
      }
    }
  };
  Usergrid.console.ui.collections.group_schema = group_schema;

})(jQuery);
