#!/usr/bin/env python3

import csv
import json
import sys

def make_json(csvFilePath, jsonFilePath):

    # dictionary to hold json data
    data = {}

    # open and read the csv file
    with open(csvFilePath, 'r', encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        # convert each row to a dictionary and add to data
        for row in csvReader:

            # use 'code' as primary key
            key = row['code']
            data[key] = row
	
	# change '0' values to 'false' to match the database
    for tree in data:
        for val in data[tree]:
            if data[tree].get(val) == "0":
                data[tree].update({val: False})

    # put all visit information into a visits and visit1 dict for each tree
    for tree in data:
        visits = {}
        individualVisit = {}
        individualVisit.update({"visitNumber": data[tree].get("visit #")})
    
        # figure out what key to use for this visit based on visit #
        indVisitKey = f"visit{data[tree].get('visit #')}"

        # move data fields inside individualVisit dict, which will be inside visit dict
        for val in data[tree]:
            if val == "code" or val == "location" or val == "species" or val == "totalNumberOfVisits":
                continue
            else:
                if val == "month":
                    if data[tree].get(val) == "1":
                        data[tree].update({val: "enero"})
                    if data[tree].get(val) == "2":
                        data[tree].update({val: "feb"})
                    if data[tree].get(val) == "3":
                        data[tree].update({val: "marzo"})
                    if data[tree].get(val) == "4":
                        data[tree].update({val: "abr"})
                    if data[tree].get(val) == "5":
                        data[tree].update({val: "mayo"})
                    if data[tree].get(val) == "6":
                        data[tree].update({val: "jun"})
                    if data[tree].get(val) == "7":
                        data[tree].update({val: "jul"})
                    if data[tree].get(val) == "8":
                        data[tree].update({val: "agosto"})
                    if data[tree].get(val) == "9":
                        data[tree].update({val: "set"})
                    if data[tree].get(val) == "10":
                        data[tree].update({val: "oct"})
                    if data[tree].get(val) == "11":
                        data[tree].update({val: "nov"})
                    if data[tree].get(val) == "12":
                        data[tree].update({val: "dic"})
                    
                individualVisit.update({val: data[tree].get(val)})

        # generate proper gps string to fit database
        gps = f"{data[tree].get('gps (latitude)')}, {data[tree].get('gps (longitude)')}"
        individualVisit.update({"gps": gps})
        individualVisit.pop("gps (latitude)")
        individualVisit.pop("gps (longitude)")


        # change name of some fields to fit database
        observation_desc = data[tree].get("observations")
        individualVisit.update({"observation_desc": observation_desc})
        individualVisit.pop("observations")

        dap = data[tree].get("dap (cm)")
        dap = dap.replace(",", ".")
        individualVisit.update({"dap": dap})
        individualVisit.pop("dap (cm)")
        individualVisit.update({"height": data[tree].get("height (m)")})
        individualVisit.pop("height (m)")

        # add deathLevel property to individualVisit dict 
        # TODO This may need to be updated
        if data[tree].get("death") == False:
            individualVisit.update({"deathLevel": "Nivel 0: Afectación 0 %"})
        elif data[tree].get("death") == True:
            individualVisit.update({"deathLevel": "Nivel 4: Afectación > 75 %"})
        else:
            individualVisit.update({"deathLevel": "Nivel 0: Afectación 0 %"})
        # we can now pop the "dead" field from the individualVisit dict
        individualVisit.pop("dead")

        # remove data fields from outer tree dict, as they have been moved to individualVisit dict inside
        data[tree].pop("gps (latitude)")
        data[tree].pop("gps (longitude)")
        data[tree].pop("observations")

        data[tree].pop("totalNumberOfVisits")
        data[tree].pop("dead")

        data[tree].pop("dap (cm)")
        data[tree].pop("day")
        data[tree].pop("flowers")
        data[tree].pop("fruits")
        data[tree].pop("fungus")
        data[tree].pop("height (m)")
        data[tree].pop("insect")
        data[tree].pop("month")
        data[tree].pop("reasonForDeath")
        data[tree].pop("visit #")
        data[tree].pop("rotten")
        data[tree].pop("sick")
        data[tree].pop("year")

        # copy two of the fields into the individualVisit dict
        individualVisit.update({"code": data[tree].get("code")})
        individualVisit.update({"location": data[tree].get("location")})
        
        # pop any values that need to be popped still
        individualVisit.pop("visit #")

        # handle the formatting for the day field
        dayString = individualVisit.get("day")
        if len(dayString) == 1:
            dayString = "0" + dayString
        individualVisit.update({"day": dayString})

        # place individualVisit dict into visit dict
        visits.update({indVisitKey: individualVisit})

        # place visit dict into the tree dict
        data[tree].update({"visits": visits})

	# open a json writer and dump data to json file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4, ensure_ascii=False))



def main():

    if len(sys.argv) != 3:
        print(f"Proper Usage: python3 {sys.argv[0]} [CSV_FILE_TO_READ_FROM] [JSON_FILE_TO_WRITE_TO]")
        return

    csvFilePath = sys.argv[1]
    jsonFilePath = sys.argv[2]

    make_json(csvFilePath, jsonFilePath)



if __name__ == "__main__":
    main()
