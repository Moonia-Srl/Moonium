"""
Script used to deploy Moonium client both in production and staging
Created by Enea Guidi
"""

import os, sys
from datetime import date

# Argument checking
if len(sys.argv) < 2:
    print("Provide which environment you want to deploy (staging, production)")
    os._exit(-1)
elif sys.argv[1] not in ["staging", "production"]:
    print(f"Unrecognized option {sys.argv[1]}")
    os._exit(-1)


deploy_env = {
    "production": {
        "env": "production",
        "name": "Production",
        "ip": "51.158.42.69",
        "path": "Production/Moonium",

    },
    "staging": {
        "env": "test",
        "name": "Staging",
        "ip": "51.158.42.69",
        "path": "Staging/Moonium"
    },
}[sys.argv[1]]

remote_cmd = "; ".join(
    [
        f"cd /opt/{deploy_env['path']}",
        "rm -rf ./*",
        "unzip -q ../../out.zip -d .",
        "rm -rf ../../out.zip",
    ]
)


deploy_msg = f"""
🚀 NEW DEPLOY

🕒 Date: {date.today().strftime("%d/%m/%Y")}
🤖 Project: Moonium (Client)
🛢 Server: {deploy_env["name"]}
🎯 Target: https://{deploy_env["path"]}
🛠 Features: ToDo Write here
"""


if __name__ == "__main__":
    print("Starting deployment process")

    # Removes the old build directory
    os.system("rm -rf out out.zip")
    # Creates a new build with the selected environment and exports static html
    os.system(f"NODE_ENV={deploy_env['env']} yarn export")
    # Zips up the build directory into an archive
    os.system("cd out && zip -r ../out.zip .")

    # Uploads the dump to the staging/production server
    os.system(f"scp out.zip regsm@{deploy_env['ip']}:/opt/")
    # Unpacks the dump to the folder path
    os.system(f"ssh regsm@{deploy_env['ip']} \"{remote_cmd}\" ")

    # Removes the old build directory
    os.system("rm -rf out out.zip")

    print("Deploy completed successfully!", "\n", deploy_msg)
