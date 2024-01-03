from setuptools import find_packages
from setuptools import setup


try:
    README = open('README.rst').read()
except IOError:
    README = None

setup(
    name='guillotina_react_app',
    version="1.0.0",
    description='This guillotina is for develop guillotina_gmi',
    long_description=README,
    install_requires=[
        'guillotina'
    ],
    author='Roger Boixader Güell',
    author_email='rboixaderg@gmail.com',
    url='',
    packages=find_packages(exclude=['demo']),
    include_package_data=True,
    tests_require=[
        'pytest',
    ],
    extras_require={
        'test': [
            'pytest'
        ]
    },
    classifiers=[],
    entry_points={
    }
)
