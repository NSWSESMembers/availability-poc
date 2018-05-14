import requests
import json
import pprint
pp = pprint.PrettyPrinter(indent=4)

data = {
  "IInId":None,
  "JobId":123456,
  "JobIdentifier":"0012-3456",
  "StatusId":1,
  "StatusName":"New",
  "TimeLogged":"2018-05-07T14:59:07.3854803+10:00",
  "SimpleJobViewModel":{
    "Id":123456,
    "Identifier":"0012-3456",
    "ICEMSIncidentIdentifier":None,
    "TypeId":4,
    "Type":"FR",
    "CallerName":"qwer ",
    "CallerNumber":"1234",
    "ContactName":None,
    "ContactNumber":None,
    "PermissionToEnterPremises":False,
    "HowToEnterPremises":None,
    "JobReceived":"2018-05-02T13:52:23",
    "JobPriorityType":{
      "Id":1,
      "Name":"Rescue",
      "Description":"Life Threatening"
    },
    "JobStatusType":{
      "Id":1,
      "Name":"New",
      "Description":"New Job"
    },
    "JobType":{
      "ParentId":5,
      "Id":4,
      "Name":"FR",
      "Description":"Flood Rescue"
    },
    "EntityAssignedTo":{
      "Id":261,
      "Code":"WOL",
      "Name":"Wollongong City",
      "Latitude":0.000000000000,
      "Longitude":0.000000000000,
      "EntityTypeId":1,
      "HeadquartersStatusTypeId":2,
      "ParentEntity":{
        "Id":18,
        "Code":"ISR",
        "Name":"Illawarra South Coast Region"
      },
      "AriaCode":None
    },
    "LGA":"WOLLONGONG",
    "Address":{
      "GnafId":"GANSW705639055",
      "Latitude":-34.41240224,
      "Longitude":150.89395331,
      "Type":None,
      "Flat":"6",
      "Level":None,
      "StreetNumber":"10",
      "Street":"ACHILLES AVENUE",
      "Locality":"NORTH WOLLONGONG",
      "PostCode":None,
      "PrettyAddress":"6/10 ACHILLES AVENUE, NORTH WOLLONGONG",
      "AdditionalAddressInfo":None
    },
    "Tags":[
      {
        "Id":123,
        "Name":"Person",
        "CreatedOn":"2014-09-18T13:59:36",
        "CreatedBy":1,
        "TagGroupId":20
      }
    ],
    "TaskingCategory":0,
    "SituationOnScene":None,
    "EventId":0,
    "PrintCount":0,
    "ActionRequiredTags":[

    ]
  }
}

headers = {'content-type': 'application/json'}

r = requests.post("http://localhost:8080/hook", data=json.dumps(data), headers=headers)
pp.pprint(r.text)
