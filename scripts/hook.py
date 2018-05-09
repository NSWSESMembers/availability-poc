import requests
import json
import pprint
pp = pprint.PrettyPrinter(indent=4)

data = {
    "Id": 28795,
    "Identifier": "0002-8795",
    "Sequence": 0,
    "FloodAssistanceJob": False,
    "ReferringAgency": None,
    "ReferringAgencyReference": None,
    "SituationOnScene": "Things about stuff",
    "EvacuationRequired": False,
    "PeopleInundated": 0,
    "PeopleExtricated": 0,
    "PeopleEvacuated": 0,
    "CreatedOn": "2017-12-11T09:22:00",
    "CreatedBy": {
        "Id": 9707,
        "FirstName": "David",
        "LastName": "Barrie",
        "FullName": "David Barrie",
        "Gender": 1,
        "RegistrationNumber": "123"
           },
    "CallerFirstName": "asdf",
    "CallerLastName": None,
    "ICEMSIncidentIdentifier": None,
    "ContactCalled": True,
    "CallerPhoneNumber": "1234",
    "ContactFirstName": None,
    "ContactLastName": None,
    "ContactPhoneNumber": None,
    "EntityAssignedTo": {
        "Id": 261,
        "Code": "WOL",
        "Name": "Wollongong City",
        "Latitude": -34.40247,
        "Longitude": 150.89495,
        "EntityTypeId": 1,
        "HeadquartersStatusTypeId": 2,
        "ParentEntity": {
    	    "Id": 18,
    	    "Code": "ISR",
    	    "Name": "Illawarra South Coast Region"
    	},
        "AriaCode": None
    },
    "LGA": "WOLLONGONG",
    "Sector": None,
    "JobPriorityType": {
        "Id": 4,
        "Name": "General",
        "Description": "General Response"
        },
    "TaskingCategory": 0,
        "JobType": {
    	    "ParentId": 1,
    	    "Id": 1,
    	    "Name": "Storm",
    	    "Description": "Storm Job"
    	    },
        "JobStatusType": {
    	    "Id": 1,
    	    "Name": "New",
    	    "Description": "New Job"
    	    },
        "Tags": [
    	    {
    		"Id": 23,
    		"Name": "Flooded",
    		"CreatedOn": "2015-08-04T11:32:33",
    		"CreatedBy": 1,
    		"TagGroupId": 6
    		}
    	    ],
        "Address": {
    	    "GnafId": "GANSW706388267",
    	    "Latitude": -34.41949,
    	    "Longitude": 150.87497,
    	    "Type": None,
    	    "Flat": None,
    	    "Level": None,
    	    "StreetNumber": "12",
    	    "Street": "GILMORE STREET",
    	    "Locality": "WEST WOLLONGONG",
    	    "PostCode": None,
    	    "PrettyAddress": "12 GILMORE STREET, WEST WOLLONGONG",
    	    "AdditionalAddressInfo": None
    	    },
        "LastModified": "2017-12-11T09:22:00",
        "LastModifiedBy": {
    	    "Id": 9707,
    	    "FirstName": "David",
    	    "LastName": "Barrie",
    	    "FullName": "David Barrie",
    	    "Gender": 1,
    	    "RegistrationNumber": "123"
    	    },
        "JobStatusTypeHistory": [
    	    {
    		"Type": 1,
    		"Name": "New",
    		"Description": "Send Message was unselected.",
    		"Timelogged": "2017-12-11T09:22:00",
    		"CreatedOn": "2017-12-11T09:22:00",
    		"CreatedBy": {
    		    "Id": 9707,
    		    "FirstName": "David",
    		    "LastName": "Barrie",
    		    "FullName": "David Barrie",
    		    "Gender": 1,
    		    "RegistrationNumber": "123"
    		    }
    		}
    	    ],
        "PermissionToEnterPremises": False,
        "HowToEnterPremises": None,
        "Event": {
    	    "Id": 19,
    	    "Name": "Big storm",
    	    "Identifier": "19/1516",
    	    "Description": "Lots of wind and rain",
    	    "District": "Illawarra",
    	    "StartTime": "2015-09-23T10:25:32",
    	    "EndTime": None
    	    },
        "JobReceived": "2017-12-11T09:20:23",
        "Reconnoitered": False,
        "AgenciesPresent": [],
        "FloodAssistance": None,
        "Type": "Storm",
        "PrintCount": 0
}

headers = {'content-type': 'application/json'}

r = requests.post("http://localhost:8080/hook", data=json.dumps(data), headers=headers)
pp.pprint(r.text)
