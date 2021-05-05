#!/usr/bin/env python3
import sys
import requests

BASE_DATA_SOURCES_URL = "http://35.195.150.105:5000/geo/data/{}/devices"


def main(models):
    owner = models[0]
    models = models[1:]
    models = list(map(lambda x: x.lower(), models))
    resp = requests.request("GET", BASE_DATA_SOURCES_URL.format(owner))
    if resp.status_code == 403:
        return resp.json()['message']
    elif resp.status_code >= 300 or resp.status_code < 200:
        return 'something bad happened'
    devices = resp.json()['message']
    counts = [0] * len(models)
    for device in devices:
        model = device['model'].lower()
        if model in models:
            counts[models.index(model)] += 1
    return ';'.join(list(map(str, counts)))


if __name__ == "__main__":
    try:
        print(main([*sys.argv[1:]]), end='')
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
