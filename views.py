#### Testing file to avoid merge conflict ####
from flask import Flask, request, redirect, render_template, send_from_directory
from validate_email import validate_email

app = Flask(__name__)

@app.route('/')
def index():
    text = fetch_text()
    return render_template('directory.html', text=text)

# Function to fetch the text
def fetch_text():
    # Replace this function with the one that fetches the text.
    text = """THESEUS:
            Now, fair Hippolyta, our nuptial hour
            Draws on apace. Four happy days bring in
            Another moon. But, O, methinks how slow
            This old moon wanes! She lingers my desires,
            Like to a stepdame or a dowager,
            Long withering out a young man's revenue.

            HIPPOLYTA:
            Four days will quickly steep themselves in night;
            Four nights will quickly dream away the time;
            And then the moon, like to a silver bow
            New-bent in heaven, shall behold the night
            Of our solemnities.

            THESEUS:
            Go, Philostrate,
            Stir up the Athenian youth to merriments;
            Awake the pert and nimble spirit of mirth;
            Turn melancholy forth to funerals;
            The pale companion is not for our pomp.

            Exit Philostrate

            Hippolyta, I wooed thee with my sword,
            And won thy love, doing thee injuries;
            But I will wed thee in another key,
            With pomp, with triumph, and with revelling.

            Enter Egeus, Hermia, Lysander, and Demetrius

            EGEUS:
            Happy be Theseus, our renowned duke!

            THESEUS:
            Thanks, good Egeus. What's the news with thee?

            EGEUS:
            Full of vexation come I, with complaint
            Against my child, my daughter Hermia.
            Stand forth, Demetrius. My noble lord,
            This man hath my consent to marry her.
            Stand forth, Lysander. And my gracious duke,
            This man hath bewitched the bosom of my child.
            Thou, thou, Lysander, thou hast given her rhymes
            And interchanged love-tokens with my child.
            Thou hast by moonlight at her window sung,
            With feigning voice, verses of feigning love,
            And stolen the impression of her fantasy
            With bracelets of thy hair, rings, gawds, conceits,
            Knacks, trifles, nosegays, sweetmeats, messengers
            Of strong prevailment in unharden'd youth:
            With cunning hast thou filch'd my daughter's heart,
            Turn'd her obedience, which is due to me,
            To stubborn harshness: and, my gracious duke,
            Be it so she will not here before your grace
            Consent to marry with Demetrius,
            I beg the ancient privilege of Athens,
            As she is mine, I may dispose of her:
            Which shall be either to this gentleman
            Or to her death, according to our law
            Immediately provided in that case.

            THESEUS:
            What say you, Hermia? Be advised, fair maid:
            To you your father should be as a god;
            One that composed your beauties, yea, and one
            To whom you are but as a form in wax
            By him imprinted and within his power
            To leave the figure or disfigure it.
            Demetrius is a worthy gentleman.

            HERMIA:
            So is Lysander.

            THESEUS:
            In himself he is;
            But in this kind, wanting your father's voice,
            The other must be held the worthier.

            HERMIA:
            I would my father look'd but with my eyes.

            THESEUS:
            Rather your eyes must with his judgment look.

            HERMIA:
            I do entreat your grace to pardon me.
            I know not by what power I am made bold,
            Nor how it may concern my modesty,
            In such a presence here to plead"""
    text = text.replace("\n", "<br>")
    return text

@app.route('/register', methods=['POST'])
def register():
    email = request.form['email']
    password = request.form['password']

    print(email, password)

    # # Validate the email address
    # if not validate_email(email):
    #     return "Invalid email address"

    # Register the user to the database
    # ...

    # Redirect to a new page
    return render_template('searchBar.html')

if __name__ == '__main__':
    app.run(debug=True)
