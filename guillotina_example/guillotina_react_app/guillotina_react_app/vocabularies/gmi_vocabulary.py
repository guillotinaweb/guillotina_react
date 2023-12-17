from guillotina import configure

_gmi_vocabulary = {
    "plone": "Plone",
    "guillotina": "Guillotina text"
}

@configure.vocabulary(name="gmi_vocabulary")
class GMIVocabulary:
    def __init__(self, context):
        self.context = context
        self.values = _gmi_vocabulary

    def keys(self):
        return self.values.keys()

    def __iter__(self):
        return iter(self.values)

    def __contains__(self, value):
        return value in self.values

    def __len__(self):
        return len(self.values)

    def getTerm(self, value):
        return self.values[value]
