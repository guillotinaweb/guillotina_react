# -*- coding: utf-8 -*-
from setuptools import Extension
from setuptools import find_packages
from setuptools import setup
from pathlib import Path

import json
import os


current_file = Path(__file__).parent.parent

long_description = open("README.md").read() + "\n"


def get_version():
    pfile = current_file / "package.json"
    with pfile.open("r") as f:
        package = json.loads(f.read())
        return package["version"]


long_description += """
Guillotina management interface
"""

setup(
    name="guillotina_gmi",
    python_requires=">=3.7.0",
    version=get_version(),
    description="guillotina management interface",  # noqa
    long_description=long_description,
    long_description_content_type='text/markdown',
    keywords=["guillotina_gmi", "zmi", "gmi"],
    author="jordi collell",
    author_email="jordic@gmail.com",
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Intended Audience :: Developers",
        "Topic :: Internet :: WWW/HTTP",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    url="https://github.com/guillotinaweb/guillotina_react",
    license="BSD",
    setup_requires=[""],
    zip_safe=False,
    include_package_data=True,
    package_data={"": ["*",'*/*','*/*/*']},
    packages=find_packages(),
    install_requires=[
    ],
    extras_require={
        "dev": [
            "twine"
        ]
    },
    entry_points={
    },
)
