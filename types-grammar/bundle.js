# You Don't Know JS Yet: Types & Grammar - 2nd Edition

| NOTE: |
| :--- |
| Work in progress |

[Table of Contents](toc.md)

* [Foreword](foreword.md) (by TBA)
* [Preface](../preface.md)
* [Chapter 1: Primitive Values](ch1.md)
* [Chapter 2: Primitive Behaviors](ch2.md)
* [Chapter 3: Object Values](ch3.md)
* [Chapter 4: Coercing Values](ch4.md)
* Chapter 5: TODO
* [Thank You!](thanks.md)
# You Don't Know JS Yet: Types & Grammar - 2nd Edition

| NOTE: |
| :--- |
| Work in progress |

## Table of Contents

* Foreword
* Preface
* Chapter 1: Primitive Values
	* Value Types
    * Empty Values
    * Boolean Values
    * String Values
    * Number Values
    * BigInteger Values
    * Symbol Values
    * Primitives Are Built-In Types
* Chapter 2: Primitive Behaviors
    * Primitive Immutability
    * Primitive Assignments
    * String Behaviors
    * Number Behaviors
    * Primitives Are Foundational
* Chapter 3: Object Values
    * Types of Objects
    * Plain Objects
    * Fundamental Objects
    * Other Built-in Objects
    * Arrays
    * Regular Expressions
    * Functions
    * Proposed: Records/Tuples
    * TODO
* Chapter 4: Coercing Values
    * Coercion: Explicit vs Implicit
    * Abstracts
    * Concrete Coercions
    * Coercion Corner Cases
    * Type Awareness
    * What's Left?
* Thank You!
# You Don't Know JS Yet: Types & Grammar - 2nd Edition
# Chapter 1: Primitive Values

| NOTE: |
| :--- |
| Work in progress |

In Chapter 1 of the "Objects & Classes" book of this series, we confronted the common misconception that "everything in JS is an object". We now circle back to that topic, and again dispel that myth.

Here, we'll look at the core value types of JS, specifically the non-object types called *primitives*.

## Value Types

JS doesn't apply types to variables or properties -- what I call, "container types" -- but rather, values themselves have types -- what I call, "value types".

The language provides seven built-in, primitive (non-object) value types: [^PrimitiveValues]

* `undefined`
* `null`
* `boolean`
* `number`
* `bigint`
* `symbol`
* `string`

These value-types define collections of one or more concrete values, each with a set of shared behaviors for all values of each type.

### Type-Of

Any value's value-type can be inspected via the `typeof` operator, which always returns a `string` value representing the underlying JS value-type:

```js
typeof true;            // "boolean"

typeof 42;              // "number"

typeof 42n;             // "bigint"

typeof Symbol("42");    // "symbol"
```

The `typeof` operator, when used against a variable instead of a value, is reporting the value-type of *the value in the variable*:

```js
greeting = "Hello";
typeof greeting;        // "string"
```

JS variables themselves don't have types. They hold any arbitrary value, which itself has a value-type.

### Non-objects?

What specifically makes the 7 primitive value types distinct from the object value types (and sub-types)? Why shouldn't we just consider them all as essentially *objects* under the covers?

Consider:

```js
myName = "Kyle";

myName.nickname = "getify";

console.log(myName.nickname);           // undefined
```

This snippet appears to silently fail to add a `nickname` property to a primitive string. Taken at face value, that might imply that primitives are really just objects under the covers, as many have (wrongly) asserted over the years.

| WARNING: |
| :--- |
| One might explain that silent failure as an example of *auto-boxing* (see "Automatic Objects" in Chapter 3), where the primitive is implicitly converted to a `String` instance wrapper object while attempting to assign the property, and then this internal object is thrown away after the statement completes. In fact, I said exactly that in the first edition of this book. But I was wrong; oops! |

Something deeper is at play, as we see in this version of the previous snippet:

```js
"use strict";

myName = "Kyle";

myName.nickname = "getify";
// TypeError: Cannot create property 'nickname'
// on string 'Kyle'
```

Interesting! In strict-mode, JS enforces a restriction that disallows setting a new property on a primitive value, as if implicitly promoting it to a new object.

By contrast, in non-strict mode, JS allows the violation to go unmentioned. So why? Because strict-mode was added to the language in ES5.1 (2011), more than 15 years in, and such a change would have broken existing programs had it not been defined as sensitive to the new strict-mode declaration.

So what can we conclude about the distinction between primitives and objects? Primitives are values that *are not allowed to have properties*; only objects are allowed such.

| TIP: |
| :--- |
| This particular distinction seems to be contradicted by expressions like `"hello".length`; even in strict-mode, it returns the expected value `5`. So it certainly *seems* like the string has a `length` property! But, as just previously mentioned, the correct explanation is *auto-boxing*; we'll cover the topic in "Automatic Objects" in Chapter 3. |

## Empty Values

The `null` and `undefined` types both typically represent an emptiness or absence of value.

Unfortunately, the `null` value-type has an unexpected `typeof` result. Instead of `"null"`, we see:

```js
typeof null;            // "object"
```

No, that doesn't mean that `null` is somehow a special kind of object. It's just a legacy of early days of JS, which cannot be changed because of how much code out in the wild it would break.

The `undefined` type is reported both for explicit `undefined` values and any place where a seemingly missing value is encountered:

```js
typeof undefined;               // "undefined"

var whatever;

typeof whatever;                // "undefined"
typeof nonExistent;             // "undefined"

whatever = {};
typeof whatever.missingProp;    // "undefined"

whatever = [];
typeof whatever[10];            // "undefined"
```

| NOTE: |
| :--- |
| The `typeof nonExistent` expression is referring to an undeclared variable `nonExistent`. Normally, accessing an undeclared variable reference would cause an exception, but the `typeof` operator is afforded the special ability to safely access even non-existent identifiers and calmly return `"undefined"` instead of throwing an exception. |

However, each respective "empty" type has exactly one value, of the same name. So `null` is the only value in the `null` value-type, and `undefined` is the only value in the `undefined` value-type.

### Null'ish

Semantically, `null` and `undefined` types both represent general emptiness, or absence of another affirmative, meaningful value.

| NOTE: |
| :--- |
| JS operations which behave the same whether `null` or `undefined` is encountered, are referred to as "null'ish" (or "nullish"). I guess "undefined'ish" would look/sound too weird! |

For a lot of JS, especially the code developers write, these two *nullish* values are interchangeable; the decision to intentionally use/assign `null` or `undefined` in any given scenario is situation dependent and left up to the developer.

JS provides a number of capabilities for helping treat the two nullish values as indistinguishable.

For example, the `==` (coercive-equality comparison) operator specifically treats `null` and `undefined` as coercively equal to each other, but to no other values in the language. As such, a `.. == null` check is safe to perform if you want to check if a value is specifically either `null` or `undefined`:

```js
if (greeting == null) {
    // greeting is nullish/empty
}
```

Another (recent) addition to JS is the `??` (nullish-coalescing) operator:

```js
who = myName ?? "User";

// equivalent to:
who = (myName != null) ? myName : "User";
```

As the ternary equivalent illustrates, `??` checks to see if `myName` is non-nullish, and if so, returns its value. Otherwise, it returns the other operand (here, `"User"`).

Along with `??`, JS also added the `?.` (nullish conditional-chaining) operator:

```js
record = {
    shippingAddress: {
        street: "123 JS Lane",
        city: "Browserville",
        state: "XY"
    }
};

console.log( record?.shippingAddress?.street );
// 123 JS Lane

console.log( record?.billingAddress?.street );
// undefined
```

The `?.` operator checks the value immediately preceding (to the left) value, and if it's nullish, the operator stops and returns an `undefined` value. Otherwise, it performs the `.` property access against that value and continues with the expression.

Just to be clear: `record?.` is saying, "check `record` for nullish before `.` property access". Additionally, `billingAddress?.` is saying, "check `billingAddress` for nullish before `.` property access".

| WARNING: |
| :--- |
| Some JS developers believe that the newer `?.` is superior to `.`, and should thus almost always be used instead of `.`. I believe that's an unwise perspective. First of all, it's adding extra visual clutter, which should only be done if you're getting benefit from it. Secondly, you should be aware of, and planning for, the emptiness of some value, to justify using `?.`. If you always expect a non-nullish value to be present in some expression, using `?.` to access a property on it is not only unnecessary/wasteful, but also could potentially hide future bugs where your assumption of value-presence had failed but `?.` covered it up. As with most features in JS, use `.` where it's most appropriate, and use `?.` where it's most appropriate. Never substitute one when the other is more appropriate. |

There's also a somewhat strange `?.[` form of the operator, not `?[`, for when you need to use `[ .. ]` style access instead of `.` access:

```js
record?.["shipping" + "Address"]?.state;    // XY
```

Yet another variation, referred to as "optional-call", is `?.(`, and is used when conditionally calling a function if the value is non-nullish:

```js
// instead of:
//   if (someFunc) someFunc(42);
//
// or:
//   someFunc && someFunc(42);

someFunc?.(42);
```

The `?.(` operator seems like it is checking to see if `someFunc(..)` is a valid function that can be called. But it's not! It's only checking to make sure the value is non-nullish before trying to invoke it. If it's some other non-nullish but also non-function value type, the execution attempt will still fail with a `TypeError` exception.

| WARNING: |
| :--- |
| Because of that gotcha, I *strongly dislike* this operator form, and caution anyone against ever using it. I think it's a poorly conceived feature that does more harm (to JS itself, and to programs) than good. There's very few JS features I would go so far as to say, "never use it." But this is one of the truly *bad parts* of the language, in my opinion. |

### Distinct'ish

It's important to keep in mind that `null` and `undefined` *are* actually distinct types, and thus `null` can be noticeably different from `undefined`. You can, carefully, construct programs that mostly treat them as indistinguishable. But that requires care and discipline by the developer. From JS's perspective, they're more often distinct.

There are cases where `null` and `undefined` will trigger different behavior by the language, which is important to keep in mind. We won't cover all the cases exhaustively here, but here's on example:

```js
function greet(msg = "Hello") {
    console.log(msg);
}

greet();            // Hello
greet(undefined);   // Hello
greet("Hi");        // Hi

greet(null);        // null
```

The `= ..` clause on a parameter is referred to as the "parameter default". It only kicks in and assigns its default value to the parameter if the argument in that position is missing, or is exactly the `undefined` value. If you pass `null`, that clause doesn't trigger, and `null` is thus assigned to the parameter.

There's no *right* or *wrong* way to use `null` or `undefined` in a program. So the takeaway is: be careful when choosing one value or the other. And if you're using them interchangeably, be extra careful.

## Boolean Values

The `boolean` type contains two values: `false` and `true`.

In the "old days", programming languages would, by convention, use `0` to mean `false` and `1` to mean `true`. So you can think of the `boolean` type, and the keywords `false` and `true`, as a semantic convenience sugar on top of the `0` and `1` values:

```js
// isLoggedIn = 1;
isLoggedIn = true;

isComplete = 0;
// isComplete = false;
```

Boolean values are how all decision making happens in a JS program:

```js
if (isLoggedIn) {
    // do something
}

while (!isComplete) {
    // keep going
}
```

The `!` operator negates/flips a boolean value to the other one: `false` becomes `true`, and `true` becomes `false`.

## String Values

The `string` type contains any value which is a collection of one or more characters, delimited (surrounding on either side) by quote characters:

```js
myName = "Kyle";
```

JS does not distinguish a single character as a different type as some languages do; `"a"` is a string just like `"abc"` is.

Strings can be delimited by double-quotes (`"`), single-quotes (`'`), or back-ticks (`` ` ``). The ending delimiter must always match the starting delimiter.

Strings have an intrinsic length which corresponds to how many code-points -- actually, code-units, more on that in a bit -- they contain.

```js
myName = "Kyle";

myName.length;      // 4
```

This does not necessarily correspond to the number of visible characters present between the start and end delimiters (aka, the string literal). It can sometimes be a little confusing to keep straight the difference between a string literal and the underlying string value, so pay close attention.

| NOTE: |
| :--- |
| We'll cover length computation of strings in detail, in Chapter 2. |

### JS Character Encodings

What type of character encoding does JS use for string characters?

You've probably heard of "Unicode" and perhaps even "UTF-8" (8-bit) or "UTF-16" (16-bit). If you're like me (before doing the research it took to write this text), you might have just hand-waved and decided that's all you need to know about character encodings in JS strings.

But... it's not. Not even close.

It turns out, you need to understand how a variety of aspects of Unicode work, and even to consider concepts from UCS-2 (2-byte Universal Character Set), which is similar to UTF-16, but not quite the same. [^UTFUCS]

Unicode defines all the "characters" we can represent universally in computer programs, by assigning a specific number to each, called code-points. These numbers range from `0` all the way up to a maximum of `1114111` (`10FFFF` in hexadecimal).

The standard notation for Unicode characters is `U+` followed by 4-6 hexadecimal characters. For example, the `❤` (heart symbol) is code-point `10084` (`2764` in hexadecimal), and is thus notated with `U+2764`.

The first group of 65,535 code points in Unicode is called the BMP (Basic Multilingual Plane). These can all be represented with 16 bits (2 bytes). When representing Unicode characters from the BMP, it's fairly straightforward, as they can *fit* neatly into single UTF-16 JS characters.

All the rest of the code points are grouped into 16 so called "supplemental planes" or "astral planes". These code-points require more than 16 bits to represent -- 21 bits to be exact -- so when representing extended/supplemental characters above the BMP, JS actually stores these code-points as a pairing of two adjacent 16-bit code units, called *surrogate halves* (or *surrogate pairs*).

For example, the Unicode code point `127878` (hexadecimal `1F386`) is `🎆` (fireworks symbol). JS stores this in a string value as two surrogate-halve code units: `U+D83C` and `U+DF86`. Keep in mind that these two parts of the whole character do *not* standalone; they're only valid/meaningful when paired immediately adjacent to each other.

This has implications on the length of strings, because a single visible character like the `🎆` fireworks symbol, when in a JS string, is a counted as 2 characters for the purposes of the string length!

We'll revisit Unicode characters in a bit, and then cover the challenges of computing string length in Chapter 2.

### Escape Sequences

If `"` or `'` are used to delimit a string literal, the contents are only parsed for *character-escape sequences*: `\` followed by one or more characters that JS recognizes and parses with special meaning. Any other characters in a string that don't parse as escape-sequences (single-character or multi-character), are inserted as-is into the string value.

For single-character escape sequences, the following characters are recognized after a `\`: `b`, `f`, `n`, `r`, `t`, `v`, `0`, `'`, `"`, and `\`. For example,  `\n` means new-line, `\t` means tab, etc.

If a `\` is followed by any other character (except `x` and `u` -- explained below), like for example `\k`, that sequence is interpreted as the `\` being an unnecessary escape, which is thus dropped, leaving just the literal character itself (`k`).

To include a `"` in the middle of a `"`-delimited string literal, use the `\"` escape sequence. Similarly, if you're including a `'` character in the middle of a `'`-delimited string literal, use the `\'` escape sequence. By contrast, a `'` does *not* need to be escaped inside a `"`-delimited string, nor vice versa.

```js
myTitle = "Kyle Simpson (aka, \"getify\"), former O'Reilly author";

console.log(myTitle);
// Kyle Simpson (aka, "getify"), former O'Reilly author
```

In text, forward slash `/` is most common. But occasionally, you need a backward slash `\`. To include a literal `\` backslash character without it performing as the start of a character-escape sequence, use the `\\` (double backslashes).

So, then... what would `\\\` (three backslashes) in a string parse as? The first two `\`'s would be a `\\` escape sequence, thereby inserting just a single `\` character in the string value, and the remaining `\` would just escape whatever character comes immediately after it.

One place backslashes show up commonly is in Windows file paths, which use the `\` separator instead of the `/` separator used in linux/unix style paths:

```js
windowsFontsPath =
    "C:\\Windows\\Fonts\\";

console.log(windowsFontsPath);
// C:\Windows\Fonts\"
```

| TIP: |
| :--- |
| What about four backslashes `\\\\` in a string literal? Well, that's just two `\\` escape sequences next to each other, so it results in two adjacent backslashes (`\\`) in the underlying string value. You might recognize there's an odd/even rule pattern at play. You should thus be able to deciper any odd (`\\\\\`, `\\\\\\\\\`, etc) or even (`\\\\\\`, `\\\\\\\\\\`, etc) number of backslashes in a string literal. |

#### Line Continuation

The `\` character followed by an actual new-line character (not just literal `n`) is a special case, and it creates what's called a line-continuation:

```js
greeting = "Hello \
Friends!";

console.log(greeting);
// Hello Friends!
```

As you can see, the new-line at the end of the `greeting = ` line is immediately preceded by a `\`, which allows this string literal to continue onto the subsequent line. Without the escaping `\` before it, a new-line -- the actual new-line, not the `\n` character escape sequence -- appearing in a `"` or `'` delimited string literal would actually produce a JS syntax parsing error.

Because the end-of-line `\` turns the new-line character into a line continuation, the new-line character is omitted from the string, as shown by the `console.log(..)` output.

| NOTE: |
| :--- |
| This line-continuation feature is often referred to as "multi-line strings", but I think that's a confusing label. As you can see, the string value itself doesn't have multiple lines, it only was defined across multiple lines via the line continuations. A multi-line string would actually have multiple lines in the underlying value. We'll revisit this topic later in this chapter when we cover Template Literals. |

### Multi-Character Escapes

Multi-character escape sequences may be hexadecimal or Unicode sequences.

Hexadecimal escape sequences are used to encode any of the base ASCII characters (codes 0-255), and look like `\x` followed by exactly two hexadecimal characters (`0-9` and `a-f` / `A-F` -- case insensitive). For example, `A9` or `a9` are decimal value `169`, which corresponds to:

```js
copyright = "\xA9";  // or "\xa9"

console.log(copyright);     // ©
```

For any normal character that can be typed on a keyboard, such as `"a"`, it's usually most readable to just specify the literal character, as opposed to a more obfuscated hexadecimal representation:

```js
"a" === "\x61";             // true
```

#### Unicode In Strings

Unicode escape sequences alone can encode any of the characters from the Unicode BMP. They look like `\u` followed by exactly four hexadecimal characters.

For example, the escape-sequence `\u00A9` (or `\u00a9`) corresponds to that same `©` symbol, while `\u263A` (or `\u263a`) corresponds to the Unicode character with code-point `9786`: `☺` (smiley face symbol).

When any character-escape sequence (regardless of length) is recognized, the single character it represents is inserted into the string, rather than the original separate characters. So, in the string `"\u263A"`, there's only one (smiley) character, not six individual characters.

But as explained earlier, many Unicode code-points are well above `65535`. For example, `1F4A9` (or `1f4a9`) is decimal code-point `128169`, which corresponds to the funny `💩` (pile-of-poo) symbol.

But `\u1F4A9` wouldn't work to include this character in a string, since it would be parsed as the Unicode escape sequence `\u1F4A`, followed by a literal `9` character. To address this limitation, a variation of Unicode escape sequences was introduced to allow an arbitrary number of hexadecimal characters after the `\u`, by surrounding them with `{ .. }` curly braces:

```js
myReaction = "\u{1F4A9}";

console.log(myReaction);
// 💩
```

Recall the earlier discussion of extended (non-BMP) Unicode characters and *surrogate halves*? The same `💩` could also be defined with two explicit code-units, that form a surrogate pair:

```js
myReaction = "\uD83D\uDCA9";

console.log(myReaction);
// 💩
```

All three representations of this same character are stored internally by JS identically, and are indistinguishable:

```js
"💩" === "\u{1F4A9}";                // true
"\u{1F4A9}" === "\uD83D\uDCA9";     // true
```

Even though JS doesn't care which way such a character is represented in your program, consider the readability differences carefully when authoring your code.

| NOTE: |
| :--- |
| Even though `💩` looks like a single character, its internal representation affects things like the length computation of a string with that character in it. We'll cover length computation of strings in Chapter 2. |

##### Unicode Normalization

Another wrinkle in Unicode string handling is that even certain single BMP characters can be represented in different ways.

For example, the `"é"` character can either be represented as itself (code-point `233`, aka `\xe9` or `\u00e9` or `\u{e9}`), or as the combination of two code-points: the `"e"` character (code-point `101`, aka `\x65`, `\u0065`, `\u{65}`) and the *combining tilde* (code-point `769`, aka `\u0301`, `\u{301}`).

Consider:

```js
eTilde1 = "é";
eTilde2 = "\u00e9";
eTilde3 = "\u0065\u0301";

console.log(eTilde1);       // é
console.log(eTilde2);       // é
console.log(eTilde3);       // é
```

The string literal assigned to `eTilde3` in this snippet stores the accent mark as a separate *combining mark* symbol. Like surrogate pairs, a combining mark only makes sense in connection with the symbol it's adjacent to (usually after).

The rendering of the Unicode symbol should be the same regardless, but how the `"é"` character is internally stored affects things like `length` computation of the containing string, as well as equality and relational comparison (more on these in Chapter 2):

```js
eTilde1.length;             // 2
eTilde2.length;             // 1
eTilde3.length;             // 2

eTilde1 === eTilde2;        // false
eTilde1 === eTilde3;        // true
```

One particular challenge is that you may copy-paste a string with an `"é"` character visible in it, and that character you copied may have been in the *composed* or *decomposed* form. But there's no visual way to tell, and yet the underlying string value in the literal will be different:

```js
"é" === "é";           // false!!
```

This internal representation difference can be quite challenging if not carefully planned for. Fortunately, JS provides a `normalize(..)` utility method on strings to help:

```js
eTilde1 = "é";
eTilde2 = "\u{e9}";
eTilde3 = "\u{65}\u{301}";

eTilde1.normalize("NFC") === eTilde2;
eTilde2.normalize("NFD") === eTilde3;
```

The `"NFC"` normalization mode combines adjacent code-points into the *composed* code-point (if possible), whereas the `"NFD"` normalization mode splits a single code-point into its *decomposed* code-points (if possible).

And there can actually be more than two individual *decomposed* code-points that make up a single *composed* code-point -- for example, a single character could have several diacritical marks applied to it.

When dealing with Unicode strings that will be compared, sorted, or length analyzed, it's very important to keep Unicode normalization in mind, and use it where necessary.

##### Unicode Grapheme Clusters

A final complication of Unicode string handling is the support for clustering of multiple adjacent code-points into a single visually distinct symbol, referred to as a *grapheme* (or a *grapheme cluster*).

An example would be a family emoji such as `"👩‍👩‍👦‍👦"`, which is actually made up of 7 code-points that all cluster/group together into a single visual symbol.

Consider:

```js
familyEmoji = "\u{1f469}\u{200d}\u{1f469}\u{200d}\u{1f466}\u{200d}\u{1f466}";

familyEmoji;            // 👩‍👩‍👦‍👦
```

This emoji is *not* a single registered Unicode code-point, and as such, there's no *normalization* that can be performed to compose these 7 separate code-points into a single entity. The visual rendering logic for such composite symbols is quite complex, well beyond what most of JS developers want to embed into our programs. Libraries do exist for handling some of this logic, but they're often large and still don't necessarily cover all of the nuances/variations.

Unlike surrogate pairs and combining marks, the symbols in grapheme clusters can in fact act as standalone characters, but have the special combining behavior when placed adjacent to each other.

This kind of complexity significantly affects length computations, comparison, sorting, and many other common string-oriented operations.

### Template Literals

I mentioned earlier that strings can alternately be delimited with `` `..` `` back-ticks:

```js
myName = `Kyle`;
```

All the same rules for character encodings, character escape sequences, and lengths apply to these types of strings.

However, the contents of these template (string) literals are additionally parsed for a special delimiter sequence `${ .. }`, which marks an expression to evaluate and interpolate into the string value at that location:

```js
myName = `Kyle`;

greeting = `Hello, ${myName}!`;

console.log(greeting);      // Hello, Kyle!
```

Everything between the `{ .. }` in such a template literal is an arbitrary JS expression. It can be simple variables like `myName`, or complex JS programs, or anything in between (even another template literal expression!).

| TIP: |
| :--- |
| This feature is commonly called "template literals" or "template strings", but I think that's confusing. "Template" usually means, in programming contexts, a reusable set of text that can be re-evaluated with different data. For example, *template engines* for pages, email templates for newsletter campaigns, etc. This JS feature is not re-usable. It's a literal, and it produces a single, immediate value (usually a string). You can put such a value in a function, and call the function multiple times. But then the function is acting as the template, not the the literal itself. I prefer instead to refer to this feature as *interpolated literals*, or the funny, short-hand: *interpoliterals*. I just think that name is more accurately descriptive. |

Template literals also have an interesting different behavior with respect to new-lines, compared to classic `"` or `'` delimited strings. Recall that for those strings, a line-continuation required a `\` at the end of each line, right before a new-line. Not so, with template literals!

```js
myPoem = `
Roses are red
Violets are blue
C3PO's a funny robot
and so R2.`;

console.log(myPoem);
//
// Roses are red
// Violets are blue
// C3PO's a funny robot
// and so R2.
```

Line-continuations with template literals do *not require* escaping. However, that means the new-line is part of the string, even the first new-line above. In other words, `myPoem` above holds a truly *multi-line string*, as shown. However, if you `\` escape the end of any line in a template literal, the new-line will be omitted, just like with non-template literal strings.

Template literals usually result in a string value, but not always. A form of template literal that may look kind of strange is called a *tagged template literal*:

```js
price = formatCurrency`The cost is: ${totalCost}`;
```

Here, `formatCurrency` is a tag applied to the template literal value, which actually invokes `formatCurrency(..)` as a function, passing it the string literals and interpolated expressions parsed from the value. This function can then assemble those in any way it sees fit -- such as formatting a `number` value as currency in the current locale -- and return whatever value, string or otherwise, that it wants.

So tagged template literals are not always strings; they can be any value. But untagged template literals *will always be* strings.

Some JS developers believe that untagged template literal strings are best to use for *all* strings, even if not using any expression interpolation or multiple lines. I disagree. I think they should only be used when interpolating (or multi-line'ing).

| TIP: |
| :--- |
| The principle I always apply in making such determinations: use the closest-matched, and least capable, feature/tool, for any task. |

Moreover, there are a few places where `` `..` `` style strings are disallowed. For example, the `"use strict"` pragma cannot use back-ticks, or the pragma will be silently ignored (and thus the program accidentally runs in non-strict mode). Also, this style of strings cannot be used in quoted property names of object literals, destruturing patterns, or in the ES Module `import .. from ..` module-specifier clause.

My take: use `` `..` `` delimited strings where allowed, but only when interpolation/multi-line is needed; and keep using `".."` or `'..'` delimited strings for everything else.

## Number Values

The `number` type contains any numeric value (whole number or decimal), such as `-42` or `3.1415926`. These values are represented by the JS engine as 64-bit, IEEE-754 double-precision binary floating-point values. [^IEEE754]

JS `number`s are always decimals; whole numbers (aka "integers") are not stored in a different/special way. An "integer" stored as a `number` value merely has nothing non-zero as its fraction portion; `42` is thus indistinguishable in JS from `42.0` and `42.000000`.

We can use `Number.isInteger(..)` to determine if a `number` value has any non-zero fraction or not:

```js
Number.isInteger(42);           // true
Number.isInteger(42.0);         // true
Number.isInteger(42.000000);    // true

Number.isInteger(42.0000001);   // false
```

### Parsing vs Coercion

If a string value holds numeric-looking contents, you may need to convert from that string value to a `number`, for mathematical operation purposes.

However, it's very important to distinguish between parsing-conversion and coercive-conversion.

We can parse-convert with JS's built-in `parseInt(..)` or `parseFloat(..)` utilities:

```js
someNumericText = "123.456";

parseInt(someNumericText,10);               // 123
parseFloat(someNumericText);                // 123.456

parseInt("42",10) === parseFloat("42");     // true

parseInt("512px");                          // 512
```

| NOTE: |
| :--- |
| Parsing is only relevant for string values, as it's a character-by-character (left-to-right) operation. It doesn't make sense to parse the contents of a `boolean`, nor to parse the contents of a `number` or a `null`; there's nothing to parse. If you pass anything other than a string value to `parseInt(..)` / `parseFloat(..)`, those utilities first convert that value to a string and then try to parse it. That's almost certainly problematic (leading to bugs) or wasteful -- `parseInt(42)` is silly, and `parseInt(42.3)` is an abuse of `parseInt(..)` to do the job of `Math.floor(..)`. |

Parsing pulls out numeric-looking characters from the string value, and puts them into a `number` value, stopping once it encounters a character that's non-numeric (e.g., not `-`, `.` or `0`-`9`). If parsing fails on the first character, both utilities return the special `NaN` value (see "Invalid Number" below), indicating the operation was invalid and failed.

When `parseInt(..)` encounters the `.` in `"123.456"`, it stops, using just the `123` in the resulting `number` value. `parseFloat(..)` by contrast accepts this `.` character, and keeps right on parsing a float with any decimal digits after the `.`.

The `parseInt(..)` utility specifically, takes as an optional -- but *actually*, rather necessary -- second argument, `radix`: the numeric base to assume for interpreting the string characters for the `number` (range `2` - `36`). `10` is for standard base-10 numbers, `2` is for binary, `8` is for octal, and `16` is for hexadecimal. Any other unusual `radix`, like `23`, assumes digits in order, `0` - `9` followed by the `a` - `z` (case insensitive) character ordination. If the specified radix is outside the `2` - `36` range, `parseInt(..)` fails as invalid and returns the `NaN` value.

If `radix` is omitted, the behavior of `parseInt(..)` is rather nuanced and confusing, in that it attempts to make a best-guess for a radix, based on what it sees in the first character. This historically has lead to lots of subtle bugs, so never rely on the default auto-guessing; always specify an explicit radix (like `10` in the calls above).

`parseFloat(..)` always parses with a radix of `10`, so no second argument is accepted.

| WARNING: |
| :--- |
| One surprising difference between `parseInt(..)` and `parseFloat(..)` is that `parseInt(..)` will not fully parse scientific notation (e.g., `"1.23e+5"`), instead stopping at the `.` as it's not valid for integers; in fact, even `"1e+5"` stops at the `"e"`. `parseFloat(..)` on the other hand fully parses scientific notation as expected. |

In contrast to parsing-conversion, coercive-conversion is an all-or-nothing sort of operation. Either the entire contents of the string are recognized as numeric (integer or floating-point), or the whole conversion fails (resulting in `NaN` -- again, see "Invalid Number" later in this chapter).

Coercive-conversion can be done explicitly with the `Number(..)` function (no `new` keyword) or with the unary `+` operator in front of the value:

```js
someNumericText = "123.456";

Number(someNumericText);        // 123.456
+someNumericText;               // 123.456

Number("512px");                // NaN
+"512px";                       // NaN
```

### Other Numeric Representations

In addition to defining numbers using traditional base-10 numerals (`0`-`9`), JS supports defining whole-number-only number literals in three other bases: binary (base-2), octal (base-8), and hexadecimal (base-16).

```js
// binary
myAge = 0b101010;
myAge;              // 42

// octal
myAge = 0o52;
myAge;              // 42

// hexadecimal
myAge = 0x2a;
myAge;              // 42
```

As you can see, the prefixes `0b` (binary), `0o` (octal), and `0x` (hexadecimal) signal defining numbers in the different bases, but decimals are not allowed on these numeric literals.

| NOTE: |
| :--- |
| JS syntax allows `0B`, `0O`, and `0X` prefixes as well. However, please don't ever use those uppercase prefix forms. I think any sensible person would agree: `0O` is much easier to confuse at a glance than `0o` (which is, itself, a bit visually ambiguous at a glance). Always stick to the lowercase prefix forms! |

It's important to realize that you're not defining a *different number*, just using a different form to produce the same underlying numeric value.

By default, JS represents the underlying numeric value in output/string fashion with standard base-10 form. However, `number` values have a built-in `toString(..)` method that produces a string representation in any specified base/radix (as with `parseInt(..)`, in the range `2` - `36`):

```js
myAge = 42;

myAge.toString(2);          // "101010"
myAge.toString(8);          // "52"
myAge.toString(16);         // "2a"
myAge.toString(23);         // "1j"
myAge.toString(36);         // "16"
```

You can round-trip any arbitrary-radix string representation back into a `number` using `parseInt(..)`, with the appropriate radix:

```js
myAge = 42;

parseInt(myAge.toString("23"),23);      // 42
```

Another allowed form for specifying number literals is using scientific notation:

```js
myAge = 4.2E1;      // or 4.2e1 or 4.2e+1

myAge;              // 42
```

`4.2E1` (or `4.2e1`) means, `4.2 * (10 ** 1)` (`10` to the `1` power). The exponent can optionally have a sign `+` or `-`. If the sign is omitted, it's assumed to be `+`. A negative exponent makes the number smaller (moves the decimal leftward) rather than larger (moving the decimal rightward):

```js
4.2E-3;             // 0.0042
```

This scientific notation form is especially useful for readability when specifying larger powers of `10`:

```js
someBigPowerOf10 = 1000000000;

// vs:

someBigPowerOf10 = 1e9;
```

By default, JS will represent (e.g., as string values, etc) either very large or very small numbers -- specifically, if the values require more than 21 digits of precision -- using this same scientific notation:

```js
ratherBigNumber = 123 ** 11;
ratherBigNumber.toString();     // "9.748913698143826e+22"

prettySmallNumber = 123 ** -11;
prettySmallNumber.toString();   // "1.0257553107587752e-23"
```

Numbers with smaller absolute values (closer to `0`) than these thresholds can still be forced into scientific notation form (as strings):

```js
plainBoringNumber = 42;

plainBoringNumber.toExponential();      // "4.2e+1"
plainBoringNumber.toExponential(0);     // "4e+1"
plainBoringNumber.toExponential(4);     // "4.2000e+1"
```

The optional argument to `toExponential(..)` specifies the number of decimal digits to include in the string representation.

Another readability affordance for specifying numeric literals in code is the ability to insert `_` as a digit separator wherever its convenient/meaningful to do so. For example:

```js
someBigPowerOf10 = 1_000_000_000;

totalCostInPennies = 123_45;  // vs 12_345
```

The decision to use `12345` (no separator), `12_345` (like "12,345"), or `123_45` (like "123.45") is entirely up to the author of the code; JS ignores the separators. But depending on the context, `123_45` could be more semantically meaningful (readability wise) than the more traditional three-digit-grouping-from-the-right-separated-with-commas style mimicked with `12_345`.

### IEEE-754 Bitwise Binary Representations

IEEE-754[^IEEE754] is a technical standard for binary representation of decimal numbers. It's widely used by most computer programming languages, including JS, Python, Ruby, etc.

I'm not going to cover it exhaustively, but I think a brief primer on how numbers work in languages like JS is more than warranted, given how few programmers have *any* familiarity with it.

In 64-bit IEEE-754 -- so called "double-precision", because originally IEEE-754 used to be 32-bit, and now it's double that! -- the 64 bits are divided into three sections: 52 bits for the number's base value (aka, "fraction", "mantissa", or "significand"), 11 bits for the exponent to raise `2` to before multiplying, and 1 bit for the sign of the ultimate value.

| NOTE: |
| :--- |
| Since only 52 of the 64 bits are actually used to represent the base value, `number` doesn't actually have `2^64` values in it. According to the specification for the `number` type[^NumberType], the number of values is precisely `2^64 - 2^53 + 3`, or about 18 quintillion, split about evenly between positive and negative numbers. |

These bits are arranged left-to-right, as so (S = Sign Bit, E = Exponent Bit, M = Mantissa Bit):

```js
SEEEEEEEEEEEMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
```

So, the number `42` (or `42.000000`) would be represented by these bits:

```
// 42:
01000000010001010000000000000000
00000000000000000000000000000000
```

The sign bit is `0`, meaning the number is positive (`1` means negative).

The 11-bit exponent is binary `10000000100`, which in base-10 is `1028`. But in IEEE-754, this value is interpreted as being stored unsigned with an "exponent bias" of `1023`, meaning that we're shifting up the exponent range from `-1022:1023` to `1:2046` (where `0` and `2047` are reserved for special representations). So, take `1028` and subtract the bias `1023`, which gives an effective exponent of `5`. We raise `2` to that value (`2^5`), giving `32`.

| NOTE: |
| :--- |
| If the subtracting `1023` from the exponent value gives a negative (e.g., `-3`), that's still interpreted as `2`'s exponent; raising `2` to negative numbers just produces smaller and smaller values. |

The remaining 52 bits give us the base value `01010000...`, interpreted as binary decimal `1.0101000...` (with all trailing zeros). Converting *that* to base-10, we get `1.3125000...`. Finally, then multiply that by `32` already computed from the exponent. The result: `42`.

As you might be able to tell now, this IEEE-754 number representation standard is called "floating point" because the decimal point "floats" back-and-forth along the bits, depending on the specified exponent value.

The number `42.0000001`, which is only different from `42.000000` by just `0.0000001`, would be represented by these bits:

```
// 42.0000001:
01000000010001010000000000000000
00000000110101101011111110010101
```

Notice how the previous bit pattern and this one differ by quite a few bits in the trailing positions! The binary decimal fraction containing all those extra `1` bits (`1.010100000000...01011111110010101`) converts to base-10 as `1.31250000312500003652`, which multiplied by `32` gives us exactly `42.0000001`.

We'll revisit more details about floating-point (im)precision in Chapter 2. But now you understand a *bit more* about how IEEE-754 works!

### Number Limits

As might be evident now that you've seen how IEEE-754 works, the 52 bits of the number's base must be shared, representing both the whole number portion (if any) as well as the decimal portion (if any), of the intended `number` value. Essentially, the larger the whole number portion to be represented, the less bits are available for the decimal portion, and vice versa.

The largest value that can accurately be stored in the `number` type is exposed as `Number.MAX_VALUE`:

```js
Number.MAX_VALUE;           // 1.7976931348623157e+308
```

You might expect that value to be a decimal value, given the representation. But on closer inspection, `1.79E308` is (approximately) `2^1024 - 1`. That seems much more like it should be an integer, right? We can verify:

```js
Number.isInteger(Number.MAX_VALUE);         // true
```

But what happens if you go above the max value?

```js
Number.MAX_VALUE === (Number.MAX_VALUE + 1);
// true -- oops!

Number.MAX_VALUE === (Number.MAX_VALUE + 10000000);
// true
```

So, is `Number.MAX_VALUE` actually the largest value representable in JS? It's certainly the largest *finite* `number` value.

IEEE-754 defines a special infinite value, which JS exposes as `Infinity`; there's also a `-Infinity` at the far other end of the number line. Values can be tested to see if they are finite or infinite:

```js
Number.isFinite(Number.MAX_VALUE);  // true

Number.isFinite(Infinity);          // false
Number.isFinite(-Infinity);         // false
```

You can't ever count upwards (with `+ 1`) from `Number.MAX_VALUE` to `Infinity`, no matter how long you let the program run, because the `+ 1` operation isn't actually incrementing beyond the top `Number.MAX_VALUE` value.

However, JS arithmetic operations (`+`, `*`, and even `/`) can definitely overflow the `number` type on the top-end, in which case `Infinity` is the result:

```js
Number.MAX_VALUE + 1E291;           // 1.7976931348623157e+308
Number.MAX_VALUE + 1E292;           // Infinity

Number.MAX_VALUE * 1.0000000001;    // Infinity

1 / 1E-308;                         // 1e+308
1 / 1E-309;                         // Infinity
```

| TIP: |
| :--- |
| The reverse is not true: an arithmetic operation on an infinite value *will never* produce a finite value. |

Going from the very large to the very, very small -- actually, closest to zero, which is not the same thing as going very, very negative! -- the smallest absolute decimal value you could theoretically store in the `number` type would be `2^-1022` (remember the IEEE-754 exponent range?), or around `2E-308`. However, JS engines are allowed by the specification to vary in their internal representations for this lower limit. Whatever the engine's effective lower limit is, it'll be exposed as `Number.MIN_VALUE`:

```js
Number.MIN_VALUE;               // 5e-324 <-- usually!
```

Most JS engines seem to have a minimum representable value around `5E-324` (about `2^-1074`). Depending on the engine and/or platform, a different value may be exposed. Be careful about any program logic that relies on such implementation-dependent values.

### Safe Integer Limits

Since `Number.MAX_VALUE` is an integer, you might assume that it's the largest integer in the language. But that's not really accurate.

The largest integer you can accurately store in the `number` type is `2^53 - 1`, or `9007199254740991`, which is *way smaller* than `Number.MAX_VALUE` (about `2^1024 - 1`). This special safer value is exposed as `Number.MAX_SAFE_INTEGER`:

```js
maxInt = Number.MAX_SAFE_INTEGER;

maxInt;             // 9007199254740991

maxInt + 1;         // 9007199254740992

maxInt + 2;         // 9007199254740992
```

We've seen that integers larger than `9007199254740991` can show up. However, those larger integers are not "safe", in that the precision/accuracy start to break down when you do operations with them. As shown above, the `maxInt + 1` and `maxInt + 2` expressions both errantly give the same result, illustrating the hazard when exceeding the `Number.MAX_SAFE_INTEGER` limit.

But what's the smallest safe integer?

Depending on how you interpret "smallest", you could either answer `0` or... `Number.MIN_SAFE_INTEGER`:

```js
Number.MIN_SAFE_INTEGER;    // -9007199254740991
```

And JS provides a utility to determine if a value is an integer in this safe range (`-2^53 + 1` - `2^53 - 1`):

```js
Number.isSafeInteger(2 ** 53);      // false
Number.isSafeInteger(2 ** 53 - 1);  // true
```

### Double Zeros

It may surprise you to learn that JS has two zeros: `0`, and `-0` (negative zero). But what on earth is a "negative zero"? [^SignedZero] A mathematician would surely balk at such a notion.

This isn't just a funny JS quirk; it's mandated by the IEEE-754[^IEEE754] specification. All floating point numbers are signed, including zero. And though JS does kind of hide the existence of `-0`, it's entirely possible to produce it and to detect it:

```js
function isNegZero(v) {
    return v == 0 && (1 / v) == -Infinity;
}

regZero = 0 / 1;
negZero = 0 / -1;

regZero === negZero;        // true -- oops!
Object.is(-0,regZero);      // false -- phew!
Object.is(-0,negZero);      // true

isNegZero(regZero);         // false
isNegZero(negZero);         // true
```

You may wonder why we'd ever need such a thing as `-0`. It can be useful when using numbers to represent both the magnitude of movement (speed) of some item (like a game character or an animation) and also its direction (e.g., negative = left, positive = right).

Without having a signed zero value, you couldn't tell which direction such an item was pointing at the moment it came to rest.

| NOTE: |
| :--- |
| While JS defines a signed zero in the `number` type, there is no corresponding signed zero in the `bigint` number type. As such, `-0n` is just interpreted as `0n`, and the two are indistinguishable. |

### Invalid Number

Mathematical operations can sometimes produce an invalid result. For example:

```js
42 / "Kyle";            // NaN
```

It's probably obvious, but if you try to divide a number by a string, that's an invalid mathematical operation.

Another type of invalid numeric operation is trying to coercively-convert a non-numeric resembling value to a `number`. As discussed earlier, we can do so with either the `Number(..)` function or the unary `+` operator:

```js
myAge = Number("just a number");

myAge;                  // NaN

+undefined;             // NaN
```

All such invalid operations (mathematical or coercive/numeric) produce the special `number` value called `NaN`.

The historical root of "NaN" (from the IEEE-754[^IEEE754] specification) is as an acronym for "Not a Number". Technically, there are about 9 quadrillion values in the 64-bit IEEE-754 number space designated as "NaN", but JS treats all of them indistinguishably as the single `NaN` value.

Unfortunately, that *not a number* meaning produces confusion, since `NaN` is *absolutely* a `number`.

| TIP: |
| :--- |
| Why is `NaN` a `number`?!? Think of the opposite: what if a mathematical/numeric operation, like `+` or `/`, produced a non-`number` value (like `null`, `undefined`, etc)? Wouldn't that be really strange and unexpected? What if they threw exceptions, so that you had to `try..catch` all your math? The only sensible behavior is, numeric/mathematical operations should *always* produce a `number`, even if that value is invalid because it came from an invalid operation. |

To avoid such confusion, I strongly prefer to define "NaN" as any of the following instead:

* "iNvalid Number"
* "Not actual Number"
* "Not available Number"
* "Not applicable Number"

`NaN` is a special value in JS, in that it's the only value in the language that lacks the *identity property* -- it's never equal to itself.

```js
NaN === NaN;            // false
```

So unfortunately, the `===` operator cannot check a value to see if it's `NaN`. But there are some ways to do so:

```js
politicianIQ = "nothing" / Infinity;

Number.isNaN(politicianIQ);         // true

Object.is(NaN,politicianIQ);        // true
[ NaN ].includes(politicianIQ);     // true
```

Here's a fact of virtually all JS programs, whether you realize it or not: `NaN` happens. Seriously, almost all programs that do any math or numeric conversions are subject to `NaN` showing up.

If you're not properly checking for `NaN` in your programs where you do math or numeric conversions, I can say with some degree of certainty: you probably have a number bug in your program somewhere, and it just hasn't bitten you yet (that you know of!).

| WARNING: |
| :--- |
| JS originally provided a global function called `isNaN(..)` for `NaN` checking, but it unfortunately has a long-standing coercion bug. `isNaN("Kyle")` returns `true`, even though the string value `"Kyle"` is most definitely *not* the `NaN` value. This is because the global `isNaN(..)` function forces any non-`number` argument to coerce to a `number` first, before checking for `NaN`. Coercing `"Kyle"` to a `number` produces `NaN`, so now the function sees a `NaN` and returns `true`! This buggy global `isNaN(..)` still exists in JS, but should never be used. When `NaN` checking, always use `Number.isNaN(..)`, `Object.is(..)`, etc. |

## BigInteger Values

As the maximum safe integer in JS `number`s is `9007199254740991` (see above), such a relatively low limit can present a problem if a JS program needs to perform larger integer math, or even just hold values like 64-bit integer IDs (e.g., Twitter Tweet IDs).

For that reason, JS provides the alternate `bigint` type (BigInteger), which can store arbitrarily large (theoretically not limited, except by finite machine memory and/or JS implementation) integers.

To distinguish a `bigint` from a whole (integer) `number` value, which would otherwise both look the same (`42`), JS requires an `n` suffix on `bigint` values:

```js
myAge = 42n;        // this is a bigint, not a number

myKidsAge = 11;     // this is a number, not a bigint
```

Let's illustrate the upper un-boundedness of `bigint`:

```js
Number.MAX_SAFE_INTEGER;        // 9007199254740991

Number.MAX_SAFE_INTEGER + 2;    // 9007199254740992 -- oops!

myBigInt = 9007199254740991n;

myBigInt + 2n;                  // 9007199254740993n -- phew!

myBigInt ** 2n;                 // 81129638414606663681390495662081n
```

As you can see, the `bigint` value-type is able to do precise arithmetic above the integer limit of the `number` value-type.

| WARNING: |
| :--- |
| Notice that the `+` operator required `.. + 2n` instead of just `.. + 2`? You cannot mix `number` and `bigint` value-types in the same expression. This restriction is annoying, but it protects your program from invalid mathematical operations that would give non-obvious unexpected results. |

A `bigint` value can also be created with the `BigInt(..)` function; for example, to convert a whole (integer) `number` value to a `bigint`:

```js
myAge = 42n;

inc = 1;

myAge += BigInt(inc);

myAge;              // 43n
```

| WARNING: |
| :--- |
| Though it may seem counter-intuitive to some readers, `BigInt(..)` is *always* called without the `new` keyword. If `new` is used, an exception will be thrown. |

That's definitely one of the most common usages of the `BigInt(..)` function: to convert `number`s to `bigint`s, for mathematical operation purposes.

But it's not that uncommon to represent large integer values as strings, especially if those values are coming to the JS environment from other language environments, or via certain exchange formats, which themselves do not support `bigint`-style values.

As such, `BigInt(..)` is useful to coerce those string values to `bigint`s:

```js
myBigInt = BigInt("12345678901234567890");

myBigInt;                       // 12345678901234567890n
```

Unlike `parseInt(..)`, if any character in the string is non-numeric (`0-9` digits or `-`), including `.` or even a trailing `n` suffix character, an exception will be thrown. In other words, `BigInt(..)` is an all-or-nothing coercion-conversion, not a parsing-conversion.

| NOTE: |
| :--- |
| I think it's absurd that `BigInt(..)` won't accept the trailing `n` character while string coercing (and thus effectively ignore it). I lobbied vehemently for that behavior, in the TC39 process, but was ultimately denied. In my opinion, it's now a tiny little gotcha wart on JS, but a wart nonetheless. |

## Symbol Values

The `symbol` type contains special opaque values called "symbols". These values can only be created by the `Symbol(..)` function:

```js
secret = Symbol("my secret");
```

| WARNING: |
| :--- |
| Just as with `BigInt(..)`, the `Symbol(..)` function must be called without the `new` keyword. |

The `"my secret"` string passed into the `Symbol(..)` function call is *not* the symbol value itself, even though it seems that way. It's merely an optional descriptive label, used only for debugging purposes for the benefit of the developer.

The underlying value returned from `Symbol(..)` is a special kind of value that resists the program/developer inspecting anything about its underlying representation. That's what I mean by "opaque".

| NOTE: |
| :--- |
| You could think of symbols as if they are monotonically incrementing integer numbers -- indeed, that's similar to how at least some JS engines implement them. But the JS engine will never expose any representation of a symbol's underlying value in any way that you or the program can see. |

Symbols are guaranteed by the JS engine to be unique (only within the program itself), and are unguessable. In other words, a duplicate symbol value can never be created in a program.

You might be wondering at this point what symbols are used for?

One typical usage is as "special" values that the developer distinguishes from any other values that could accidentally collide. For example:

```js
EMPTY = Symbol("not set yet");
myNickname = EMPTY;

// later:

if (myNickname == EMPTY) {
    // ..
}
```

Here, I've defined a special `EMPTY` value and initialized `myNickname` to it. Later, I check to see if it's still that special value, and then perform some action if so. I might not want to have used `null` or `undefined` for such purposes, as another developer might be able to pass in one of those common built-in values. `EMPTY` by contrast here is a unique, unguessable value that only I've defined and have control over and access to.

Perhaps even more commonly, symbols are often used as special (meta-) properties on objects:

```js
myInfo = {
    name: "Kyle Simpson",
    nickname: "getify",
    age: 42
};

// later:
PRIVATE_ID = Symbol("private unique ID, don't touch!");

myInfo[PRIVATE_ID] = generateID();
```

It's important to note that symbol properties are still publicly visible on any object; they're not *actually* private. But they're treated as special and set-apart from the normal collection of object properties. It's similar to if I had done instead:

```js
Object.defineProperty(myInfo,"__private_id_dont_touch",{
    value: generateID(),
    enumerable: false,
});
```

By convention only, most developers know that if a property name is prefixed with `_` (or even more so, `__`!), that means it's "pseudo-private" and to leave it alone unless they're really supposed to access it.

Symbols basically serve the same use-case, but a bit more ergonomically than the prefixing approach.

### Well-Known Symbols (WKS)

JS pre-defines a set of symbols, referred to as *well-known symbols* (WKS), that represent certain special meta-programming hooks on objects. These symbols are stored as static properties on the `Symbol` function object. For example:

```js
myInfo = {
    // ..
};

String(myInfo);         // [object Object]

myInfo[Symbol.toStringTag] = "my-info";
String(myInfo);         // [object my-info]
```

`Symbol.toStringTag` is a well-known symbol for accessing and overriding the default string representation of a plain object (`"[object Object]"`), replacing the `"Object"` part with a different value (e.g., `"my-info"`).

See the "Objects & Classes" book of this series for more information about Well-Known Symbols and metaprogramming.

### Global Symbol Registry

Often, you want to keep symbol values private, such as inside a module scope. But occasionally, you want to expose them so they're accessible globally throughout all the files in a JS program.

Instead of just attaching them as global variables (i.e., properties on the `globalThis` object), JS provides an alternate *global namespace* to register symbols in:

```js
// retrieve if already registered,
// otherwise register
PRIVATE_ID = Symbol.for("private-id");

// elsewhere:

privateIDKey = Symbol.keyFor(PRIVATE_ID);
privateIDKey;           // "private-id"

// elsewhere:

// retrieve symbol from registry undeer
// specified key
privateIDSymbol = Symbol.for(privateIDKey);
```

The value passed to `Symbol.for(..)` is *not* the same as passed to `Symbol(..)`. `Symbol.for(..)` expects a unique *key* for the symbol to be registered under in the global registry, whereas `Symbol(..)` optionally accepts a descriptive label (not necessarily unique).

If the registry doesn't have a symbol under that specified *key*, a new symbol (with no descriptive label) is created and automatically registered there. Otherwise, `Symbol.for(..)` returns whatever previously registered symbol is under that *key*.

Going in the opposite direction, if you have the symbol value itself, and want to retrieve the *key* it's registered under, `Symbol.keyFor(..)` takes the symbol itself as input, and returns the *key* (if any). That's useful in case it's more convenient to pass around the *key* string value than the symbol itself.

### Object or Primitive?

Unlike other primitives like `42`, where you can create multiple copies of the same value, symbols *do* act more like specific object references in that they're always completely unique (for purposes of value assignment and equality comparison). The specification also categorizes the `Symbol()` function under the "Fundamental Objects" section, calling the function a "constructor", and even defining its `prototype` property.

However, as mentioned earlier, `new` cannot be used with `Symbol(..)`; this is similar to the `BigInt()` "constructor". We clearly know `bigint` values are primitives, so `symbol` values seem to be of the same *kind*.

And in the specification's "Terms and Definitions", it lists symbol as a primitive value. [^PrimitiveValues] Moreover, the values themselves are used in JS programs as primitives rather than objects. For example, symbols are primarily used as keys in objects -- we know objects cannot use other object values as keys! -- along with strings, which are also primitives.

As mentioned earlier, some JS engines even internally implement symbols as unique, monotonically incrementing integers (primitives!).

Finally, as explained at the top of this chapter, we know primitive values are *not allowed* to have properties set on them, but are *auto-boxed* (see "Automatic Objects" in Chapter 3) internally to the corresponding object-wrapper type to facilitate property/method access. Symbols follow all these exact behaviors, the same as all the other primitives.

All this considered, I think symbols are *much more* like primitives than objects, so that's how I present them in this book.

## Primitives Are Built-In Types

We've now dug deeply into the seven primitive (non-object) value types that JS provides automatically built-in.

Before we move on to discussing JS's built-in object value type, we want to take a closer look at the kinds of behaviors we can expect from JS values. We'll do so in-depth, in the next chapter.

[^PrimitiveValues]: "4.4.5 primitive value", ECMAScript 2022 Language Specification; https://tc39.es/ecma262/#sec-primitive-value ; Accessed August 2022

[^UTFUCS]: "JavaScript’s internal character encoding: UCS-2 or UTF-16?"; Mathias Bynens; January 20 2012; https://mathiasbynens.be/notes/javascript-encoding ; Accessed July 2022

[^IEEE754]: "IEEE-754"; https://en.wikipedia.org/wiki/IEEE_754 ; Accessed July 2022

[^NumberType]: "6.1.6.1 The Number Type", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-ecmascript-language-types-number-type ; Accessed August 2022

[^SignedZero]: "Signed Zero", Wikipedia; https://en.wikipedia.org/wiki/Signed_zero ; Accessed August 2022
# You Don't Know JS Yet: Types & Grammar - 2nd Edition
# Chapter 2: Primitive Behaviors

| NOTE: |
| :--- |
| Work in progress |

So far, we've explored seven built-in primitive value types in JS: `null`, `undefined`, `boolean`, `string`, `number`, `bigint`, and `symbol`.

Chapter 1 was quite a lot to take in, much more involved than I bet most readers expected. If you're still catching your breath after reading all that, don't worry about taking a bit of a break before continuing on here!

Once you're clear headed and ready to move on, let's dig into certain behaviors implied by value types for all their respective values. We'll take a careful and  closer look at all of these various behaviors.

## Primitive Immutability

All primitive values are immutable, meaning nothing in a JS program can reach into the contents of the value and modify it in any way.

```js
myAge = 42;

// later:

myAge = 43;
```

The `myAge = 43` statement doesn't change the value. It reassigns a different value `43` to `myAge`, completely replacing the previous value of `42`.

New values are also created through various operations, but again these do not modify the original value:

```js
42 + 1;             // 43

"Hello" + "!";      // "Hello!"
```

The values `43` and `"Hello!"` are new, distinct values from the previous `42` and `"Hello"` values, respectively.

Even a string value, which looks like merely an array of characters -- and array contents are typically mutable -- is immutable:

```js
greeting = "Hello.";

greeting[5] = "!";

console.log(greeting);      // Hello.
```

| WARNING: |
| :--- |
| In non-strict mode, assigning to a read-only property (like `greeting[5] = ..`) silently fails. In strict-mode, the disallowed assignment will throw an exception. |

The nature of primitive values being immutable is not affected *in any way* by how the variable or object property holding the value is declared. For example, whether `const`, `let`, or `var` are used to declare the `greeting` variable above, the string value it holds is immutable.

`const` doesn't create immutable values, it declares variables that cannot be reassigned (aka, immutable assignments) -- see the "Scope & Closures" title of this series for more information.

A property on an object may be marked as read-only -- with the `writable: false` descriptor attribute, as discussed in the "Objects & Classes" title of this series. But that still has no affect on the nature of the value, only on preventing the reassignment of the property.

### Primitives With Properties?

Additionally, properties *cannot* be added to any primitive values:

```js
greeting = "Hello.";

greeting.isRendered = true;

greeting.isRendered;        // undefined
```

This snippet looks like it's adding a property `isRendered` to the value in `greeting`, but this assignment silently fails (even in strict-mode).

Property access is not allowed in any way on nullish primitive values `null` and `undefined`. But properties *can* be accessed on all other primitive values -- yes, that sounds counter-intuitive.

For example, all string values have a read-only `length` property:

```js
greeting = "Hello.";

greeting.length;            // 6
```

`length` can not be set, but it can be accesses, and it exposes the number of code-units stored in the value (see "JS Character Encodings" in Chapter 1), which often means the number of characters in the string.

| NOTE: |
| :--- |
| Sort of. For most standard characters, that's true; one character is one code-point, which is one code-unit. However, as explained in Chapter 1, extended Unicode characters above code-point `65535` will be stored as two code-units (surrogate halves). Thus, for each such character, `length` will include `2` in its count, even though the character visually prints as one symbol. |

Non-nullish primitive values also have a couple of standard built-in methods that can be accessed:

```js
greeting = "Hello.";

greeting.toString();    // "Hello." <-- redundant
greeting.valueOf();     // "Hello."
```

Additionally, most of the primitive value-types define their own methods with specific behaviors inherent to that type. We'll cover these later in this chapter.

| NOTE: |
| :--- |
| As already briefly mentioned in Chapter 1, technically, these sorts of property/method accesses on primitive values are facilitated by an implicit coercive behavior called *auto-boxing*. We'll cover this in detail in "Automatic Objects" in Chapter 3. |

## Primitive Assignments

Any assignment of a primitive value from one variable/container to another is a *value-copy*:

```js
myAge = 42;

yourAge = myAge;        // assigned by value-copy

myAge;                  // 42
yourAge;                // 42
```

Here, the `myAge` and `yourAge` variables each have their own copy of the number value `42`.

| NOTE: |
| :--- |
| Inside the JS engine, it *may* be the case that only one `42` value exists in memory, and the engine points both `myAge` and `yourAge` variables at the shared value. Since primitive values are immutable, there's no danger in a JS engine doing so. But what's important to us as JS developers is, in our programs, `myAge` and `yourAge` act as if they have their own copy of that value, rather than sharing it. |

If we later reassign `myAge` to `43` (when I have a birthday), it doesn't affect the `42` that's still assigned to `yourAge`:

```js
myAge++;            // sort of like: myAge = myAge + 1

myAge;              // 43
yourAge;            // 42 <-- unchanged
```

## String Behaviors

String values have a number of specific behaviors that every JS developer should be aware of.

### String Character Access

Though strings are not actually arrays, JS allows `[ .. ]` array-style access of a character at a numeric (`0`-based) index:

```js
greeting = "Hello!";

greeting[4];            // "o"
```

If the value/expression between the `[ .. ]` doesn't resolve to a number, the value will be implicitly coerced to its whole/integer numeric representation (if possible).

```js
greeting["4"];          // "o"
```

If the value/expression resolves to a number outside the integer range of `0` - `length - 1` (or `NaN`), or if it's not a `number` value-type, the access will instead be treated as a property access with the string equivalent property name. If the property access thus fails, the result is `undefined`.

| NOTE: |
| :--- |
|  We'll cover coercion in-depth later in the book. |

### Character Iteration

Strings are not arrays, but they certainly mimic arrays closely in many ways. One such behavior is that, like arrays, strings are iterables. This means that the characters (code-units) of a string can be iterated individually:

```js
myName = "Kyle";

for (let char of myName) {
    console.log(char);
}
// K
// y
// l
// e

chars = [ ...myName ];
chars;
// [ "K", "y", "l", "e" ]
```

Values, such as strings and arrays, are iterables (via `...`, `for..of`, and `Array.from(..)`), if they expose an iterator-producing method at the special symbol property location `Symbol.iterator` (see "Well-Known Symbols" in Chapter 1):

```js
myName = "Kyle";
it = myName[Symbol.iterator]();

it.next();      // { value: "K", done: false }
it.next();      // { value: "y", done: false }
it.next();      // { value: "l", done: false }
it.next();      // { value: "e", done: false }
it.next();      // { value: undefined, done: true }
```

| NOTE: |
| :--- |
| The specifics of the iterator protocol, including the fact that the `{ value: "e" .. }` result still shows `done: false`, are covered in detail in the "Sync & Async" title of this series. |

### Length Computation

As mentioned in Chapter 1, string values have a `length` property that automatically exposes the length of the string; this property can only be accessed; attempts to set it are silently ignored.

The reported `length` value somewhat corresponds to the number of characters in the string (actually, code-units), but as we saw in Chapter 1, it's more complex when Unicode characters are involved.

Most people visually distinguish symbols as separate characters; this notion of an independent visual symbol is referred to as a *grapheme*, or a *grapheme cluster*. So when counting the "length" of a string, we typically mean that we're counting the number of graphemes.

But that's not how the computer deals with characters.

In JS, each *character* is a code-unit (16 bits), with a code-point value at or below `65535`. The `length` property of a string always counts the number of code-units in the string value, not code-points. A code-unit might represent a single character by itself, or it may be part of a surrogate pair, or it may be combined with an adjacent *combining* symbol, or part of a grapheme cluster. As such, `length` doesn't match the typical notion of counting visual characters/graphemes.

To get closer to an expected/intuitive *grapheme length* for a string, the string value first needs to be normalized with `normalize("NFC")` (see "Normalizing Unicode" in Chapter 1) to produce any *composed* code-units (where possible), in case any characters were originally stored *decomposed* as separate code-units.

For example:

```js
favoriteItem = "teléfono";
favoriteItem.length;            // 9 -- uh oh!

favoriteItem = favoriteItem.normalize("NFC");
favoriteItem.length;            // 8 -- phew!
```

Unfortunately, as we saw in Chapter 1, we'll still have the possibility of characters of code-point greater the `65535`, and thus needing a surrogate pair to be represented. Such characters will count double in the `length`:

```js
// "☎" === "\u260E"
oldTelephone = "☎";
oldTelephone.length;            // 1

// "📱" === "\u{1F4F1}" === "\uD83D\uDCF1"
cellphone = "📱";
cellphone.length;               // 2 -- oops!
```

So what do we do?

One fix is to use character iteration (via `...` operator) as we saw in the previous section, since it automatically returns each combined character from a surrogate pair:

```js
cellphone = "📱";
cellphone.length;               // 2 -- oops!
[ ...cellphone ].length;        // 1 -- phew!
```

But, unfortunately, grapheme clusters (as explained in Chapter 1) throw yet another wrench into a string's length computation. For example, if we take the thumbs down emoji (`"\u{1F44E}"` and add to it the skin-tone modifier for medium-dark skin (`"\u{1F3FE}"`), we get:

```js
// "👎🏾" = "\u{1F44E}\u{1F3FE}"
thumbsDown = "👎🏾";

thumbsDown.length;              // 4 -- oops!
[ ...thumbsDown ].length;       // 2 -- oops!
```

As you can see, these are two distinct code-points (not a surrogate pair) that, by virtue of their ordering and adjacency, cause the computer's Unicode rendering to draw the thumbs-down symbol but with a darker skin tone than its default. The computed string length is thus `2`.

It would take replicating most of a platform's complex Unicode rendering logic to be able to recognize such clusters of code-points as a single "character" for length-counting sake. There are libraries that purport to do so, but they're not necessarily perfect, and they come at a hefty cost in terms of extra code.

| NOTE: |
| :--- |
| As a Twitter user, you might expect to be able to put 280 thumbs-down emojis into a single tweet, since it looks like a single character. Twitter counts the `"👎"` (default thumbs-down), the `"👎🏾"` (medium-dark-skintone thumbs-down), and even the `"👩‍👩‍👦‍👦"` (family emoji grapheme cluster) all as 2 characters each, even though their respective string lengths (from JS's perspective) are `2`, `4`, and `7`; thus, you can only fit half the number of emojis (140 instead of 280) in a tweet. In fact, Twitter implemented this change in 2018 to specifically level the counting of all Unicode characters, at 2 characters per symbol. [^TwitterUnicode] That was a welcomed change for Twitter users, especially those who want to use emoji characters that are most representative of intended gender, skintone, etc. Still, it *is* curious that Twitter chose to count all Unicode/emoji symbols as 2 characters each, instead of the more intuitive 1 character (grapheme) each. |

Counting the *length* of a string to match our human intuitions is a remarkably challenging task, perhaps more of an art than a science. We can get acceptable approximations in many cases, but there's plenty of other cases that may confound our programs.

### Internationalization (i18n) and Localization (l10n)

To serve the growing need for JS programs to operate as expected in any international language/culture context, the ECMAScript committee also publishes the ECMAScript Internationalization API. [^INTLAPI]

A JS program defaults to a locale/language according to the environment running the program (web browser page, Node instance, etc). The in-effect locale affects sorting (and value comparisons), formatting, and several other assumed behaviors. Such altered behaviors are perhaps a bit more obvious with strings, but they can also be seen with numbers (and dates!).

But string characters also can have language/locale information embedded in them, which takes precedence over the environment default. If the string character is ambiguous/shared in terms of its language/locale (such as `"a"`), the default environment setting is used.

Depending on the contents of the string, it may be interpreted as being ordered from left-to-right (LTR) or right-to-left (RTL). As such, many of the string methods we'll cover later use logical descriptors in their names, like "start", "end", "begin", "end", and "last", rather than directional terms like "left" and "right".

For example, Hebrew and Arabic are both common RTL languages:

```js
hebrewHello = "\u{5e9}\u{5dc}\u{5d5}\u{5dd}";

console.log(hebrewHello);                       // שלום
```

Notice that the first listed character in the string literal (`"\u{5e9}"`) is actually the right-most character when the string is rendered?

Even though Hebrew is an RTL language, you don't actually type the characters in the string literal in reversed (RTL) order the way they should be rendered. You enter the characters in logical order, where position `0` is the first character, position `1` is the second character, etc. The rendering layer is where RTL characters are reversed to be shown in their correct order.

That also means that if you access `hebrewHello[0]` (or `hebrewHello.charAt(0)`) -- to get the character as position `0` -- you get `"ש"` because that's logically the first character of the string, not `"ם"` (logically the last character of the string). Index-positional access follows the logical position, not the rendered position.

Here's the same example in another RTL language, Arabic:

```js
arabicHello = "\u{631}\u{62d}\u{628}\u{627}";

console.log(arabicHello);                       // رحبا

console.log(arabicHello[0]);                    // ر
```

JS programs can force a specific language/locale, using various `Intl` APIs such as `Intl.Collator`: [^INTLCollator]

```js
germanStringSorter = new Intl.Collator("de");

listOfGermanWords = [ /* .. */ ];

germanStringSorter.compare("Hallo","Welt");
// -1 (or negative number)

// examples adapted from MDN:
//
germanStringSorter.compare("Z","z");
// 1 (or positive number)

caseFirstSorter = new Intl.Collator("de",{ caseFirst: "upper", });
caseFirstSorter.compare("Z","z");
// -1 (or negative number)
```

Multiple-word strings can be segmented using `Intl.Segmenter`: [^INTLSegmenter]

```js
arabicHelloWorld = "\u{645}\u{631}\u{62d}\u{628}\u{627} \
\u{628}\u{627}\u{644}\u{639}\u{627}\u{644}\u{645}";

console.log(arabicHelloWorld);      // مرحبا بالعالم

arabicSegmenter = new Intl.Segmenter("ar",{ granularity: "word" });

for (
    let { segment: word, isWordLike } of
    arabicSegmenter.segment(arabicHelloWorld)
) {
    if (isWordLike) {
        console.log(word);
    }
}
// مرحبا
//لعالم
```

| NOTE: |
| :--- |
| The `segment(..)` method (from instances of`Intl.Segmenter`) returns a standard JS iterator, which the `for..of` loop here consumes. More on iteration protocols in the "Sync & Async" title of this series. |

### String Comparison

String values can be compared (for both equality and relational ordering) to other string values, using various built-in operators. It's important to keep in mind that such comparisons are sensitive to the actual string contents, including especially the underlying code-points from non-BPM Unicode characters.

Both equality and relational comparison are case-sensitive, for any characters where uppercase and lowercase are well-defined. To make case-insensitive comparisons, normalize the casing of both values first (with `toUpperCase()` or `toLowerCase()`).

#### String Equality

The `===` and `==` operators (along with their negated counterparts `!==` and `!=`, respectively) are the most common way equality comparisons are made for primitive values, including string values:

```js
"my name" === "my n\x61me";               // true

"my name" !== String.raw`my n\x61me`;     // true
```

The `===` operator[^StrictEquality] -- often referred to as "strict equality" -- first checks to see if the types match, and if not, returns `false` right away. If the types match, then it checks to see if the values are the same; for strings, this is a per-code-unit comparison, from start to end.

Despite the "strict" naming, there are nuances to `===` (such as `-0` and `NaN` handling), but we'll cover those later.

##### Coercive Equality

By contrast, the `==` operator[^LooseEquality] -- often referred to as "loose equality" -- performs *coercive equality*: if the value-types of the two operands do not match, `==` first coerces one or both operands until the value-types *do* match, and then it hands off the comparison internally to `===`.

Coercion is an extremely important topic -- it's an inherent part of the JS types system, one of the language's 3 pillars -- but we're only going to briefly introduce it here in this chapter, and revisit it in detail later.

| NOTE: |
| :--- |
| You may have heard the oft-quoted, but nevertheless inaccurate, explanation that the difference between `==` and `===` is that `==` compares the values while `==` compares both the values and the types. Not true, and you can read the spec yourself to verify -- both `isStrictlyEqual(..)` and `isLooselyEqual(..)` specification algorithms are linked as footnotes in the preceding paragraphs. To summarize, though: both `==` and `===` are aware of and sensitive to the types of the operands. If the operand types are the same, both operators do literally the exact same thing; if the types differ, `==` forces coercion until the types match, whereas `===` returns `false` immediately. |

It's extremely common for developers to assert that the `==` operator is confusing and too hard to use without surprises (thus the near universal preference for `===`). I think that's totally bogus, and in fact, JS developers should be defaulting to `==` (and avoiding `===` if possible). But we need a lot more discussion to back such a controversial statement; hold onto your objections until we revisit it later.

For now, to gain some intuition about the coercive nature of `==`, the most illuminating observation is that if the types don't match, `==` *prefers* numeric comparison. That means it will attempt to convert both operands to numbers, and then perform the equality check (the same as `===`).

So, as it relates to our present discussion, actual string equality can *only be* checked if both operands are already strings:

```js
// actual string equality check (via === internally):
"42" == "42";           // true
```

`==` does not really perform string equality checks itself. If the operand value-types are both strings, `==` just hands off the comparison to `===`. If they're not both strings, the coercive steps in `==` will reduce the comparison matching to numeric instead of string:

```js
// numeric (not string!) equality check:
42 == "42";             // true
```

We'll cover numeric equality later in this chapter.

##### *Really* Strict Equality

In addition to `==` and `===`, JS provides the `Object.is(..)` utility, which returns `true` if both arguments are *exactly identical*, and `false` otherwise (no exceptions or nuances):

```js
Object.is("42",42);             // false

Object.is("42","\x34\x32");     // true
```

Since `===` adds a `=` onto the end of `==` to make it more strict in behavior, I kind of half-joke that the `Object.is(..)` utility is like a `====` (a fourth `=` added) operator, for the really-truly-strict-no-exceptions kind of equality checking!

That said, `===` (and `==` by virtue of its internal delegation to `===`) are *extremely predictable*, with no weird exceptions, when it comes to comparing two actually-already-string values. I strongly recommend using `==` for such checks (or `===`), and reserve `Object.is(..)` for the corner cases (which are numeric).

#### String Relational Comparisons

In addition to equality checks between strings, JS supports relational comparisons between primitive values, like strings: `<`, `<=`, `>`, and `>=`.

The `<` (less-than) and `>` (greater-than) operations compare two string values lexicographically -- like you would sort words in a dictionary -- and should thus be fairly self explanatory:

```js
"hello" < "world";          // true
```

| NOTE: |
| :--- |
| As mentioned earlier, the running JS program has a default locale, and these operators compare according to that locale. |

Like `==`, the `<` and `>` operators are numerically coercive. Any non-number values are coerced to numbers. So the only way to do a relational comparison with strings is to ensure both operands are already string values.

Perhaps somewhat surprisingly, the `<` and `>` have no strict-comparison equivalent, the way `===` avoids the coercion of `==`. These operators are always coercive (when the types don't match), and there's no way in JS to avoid that.

So what happens when both values are *numeric-looking* strings?

```js
"100" < "11";               // true
```

Numerically, of course, `100` should *not be* less than `11`.

But relational comparisons between two strings use the lexicographic ordering. So the second `"0"` character (in `"100"`) is less than the second `"1"` (in `"11"`), and thus `"100"` would be sorted in a *dictionary* before `"11"`. The relational operators only coerce to numbers if the operand types are not already strings.

The `<=` (less-than-or-equal) and `>=` (greater-than-or-equal) operators are effectively a shorthand for a compound check.

```js
"hello" <= "hello";                             // true
("hello" < "hello") || ("hello" == "hello");    // true

"hello" >= "hello";                             // true
("hello" > "hello") || ("hello" == "hello");    // true
```

| NOTE: |
| :--- |
| Here's an interesting bit of specification nuance: JS doesn't actually define the underlying greater-than (for `>`) or greater-than-or-equal (for `>=`) operations. Instead, it defines them by reversing the arguments to their *less-than* complement counterparts. So `x > y` is treated by JS essentially as `y <= x`, and `x >= y` is treated by JS essentially as `y < x`. So JS only needs to specify how `<` and `==` work, and thus gets `>` and `>=` for free! |

##### Locale-Aware Relational Comparisons

As I mentioned a moment ago, the relational operators assume and use the current in-effect locale. However, it can sometimes be useful to force a specific locale for comparisons (such as when sorting a list of strings).

JS provides the method `localCompare(..)` on JS strings for this purpose:

```js
"hello".localeCompare("world");
// -1 (or negative number)

"world".localeCompare("hello","en");
// 1 (or positive number)

"hello".localeCompare("hello","en",{ ignorePunctuation: true });
// 0

// examples from MDN:
//
// in German, ä sorts before z
"ä".localeCompare("z","de");
// -1 (or negative number) // a negative value

// in Swedish, ä sorts after z
"ä".localeCompare("z","sv");
// 1 (or positive number)
```

The optional second and third arguments to `localeCompare(..)` control which locale to use, via the `Intl.Collator` API[^INTLCollatorApi], as covered earlier.

You might use `localeCompare(..)` when sorting an array of strings:

```js
studentNames = [
    "Lisa",
    "Kyle",
    "Jason"
];

// Array::sort() mutates the array in place
studentNames.sort(function alphabetizeNames(name1,name2){
    return name1.localeCompare(name2);
});

studentNames;
// [ "Jason", "Kyle", "Lisa" ]
```

But as discussed earlier, a more straightforward way (and slightly more performant when sorting many strings) is using `Intl.Collator` directly:

```js
studentNames = [
    "Lisa",
    "Kyle",
    "Jason"
];

nameSorter = new Intl.Collator("en");

// Array::sort() mutates the array in place
studentNames.sort(nameSorter.compare);

studentNames;
// [ "Jason", "Kyle", "Lisa" ]
```

### String Concatenation

Two or more string values can be concatenated (combined) into a new string value, using the `+` operator:

```js
greeting = "Hello, " + "Kyle!";

greeting;               // Hello, Kyle!
```

The `+` operator will act as a string concatenation if either of the two operands (values on left or right sides of the operator) are already a string (even an empty string `""`).

If one operand is a string and the other is not, the one that's not a string will be coerced to its string representation for the purposes of the concatenation:

```js
userCount = 7;

status = "There are " + userCount + " users online";

status;         // There are 7 users online
```

String concatenation of this sort is essentially interpolation of data into the string, which is the main purpose of template literals (see Chapter 1). So the following code will have the same outcome but is generally considered to be the more preferred approach:

```js
userCount = 7;

status = `There are ${userCount} users online`;

status;         // There are 7 users online
```

Other options for string concatenation include `"one".concat("two","three")` and `[ "one", "two", "three" ].join("")`, but these kinds of approaches are only preferable when the number of strings to concatenate is dependent on runtime conditions/computation. If the string has a fixed/known set of content, as above, template literals are the better option.

### String Value Methods

String values provide a whole slew of additional string-specific methods (as properties):

* `charAt(..)`: produces a new string value at the numeric index, similar to `[ .. ]`; unlike `[ .. ]`, the result is always a string, either the character at position `0` (if a valid number outside the indices range), or the empty string `""` (if missing/invalid index)

* `at(..)` is similar to `charAt(..)`, but negative indices count backwards from the end of the string

* `charCodeAt(..)`: returns the numeric code-unit (see "JS Character Encodings" in Chapter 1) at the specified index

* `codePointAt(..)`: returns the whole code-point starting at the specified index; if a surrogate pair is found there, the whole character (code-point) s returned

* `substr(..)` / `substring(..)` / `slice(..)`: produces a new string value that represents a range of characters from the original string; these differ in how the range's start/end indices are specified or determined

* `toUpperCase()`: produces a new string value that's all uppercase characters

* `toLowerCase()`: produces a new string value that's all lowercase characters

* `toLocaleUpperCase()` / `toLocaleLowerCase()`: uses locale mappings for uppercase or lowercase operations

* `concat(..)`: produces a new string value that's the concatenation of the original string and all of the string value arguments passed in

* `indexOf(..)`: searches for a string value argument in the original string, optionally starting from the position specified in the second argument; returns the `0`-based index position if found, or `-1` if not found

* `lastIndexOf(..)`: like `indexOf(..)` but, from the end of the string (right in LTR locales, left in RTL locales)

* `includes(..)`: similar to `indexOf(..)` but returns a boolean result

* `search(..)`: similar to `indexOf(..)` but with a regular-expression matching as specified

* `trimStart()` / `trimEnd()` / `trim()`: produces a new string value with whitespace trimmed from the start of the string (left in LTR locales, right in RTL locales), or the end of the string (right in LTR locales, left in RTL locales), or both

* `repeat(..)`: produces a new string with the original string value repeated the specified number of times

* `split(..)`: produces an array of string values as split at the specified string or regular-expression boundaries

* `padStart(..)` / `padEnd(..)`: produces a new string value with padding (default " " whitespace, but can be overridden) applied to either the start (left in LTR locales, right in RTL locales) or the end (right in LTR locales), left in RTL locales), so that the final string result is at least of a specified length

* `startsWith(..)` / `endsWith(..)`: checks either the start (left in LTR locales, right in RTL locales) or the end (right in LTR locales) of the original string for the string value argument; returns a boolean result

* `match(..)` / `matchAll(..)`: returns an array-like regular-expression matching result against the original string

* `replace(..)`: returns a new string with a replacement from the original string, of one or more matching occurrences of the specified regular-expression match

* `normalize(..)`: produces a new string with Unicode normalization (see "Unicode Normalization" in Chapter 1) having been performed on the contents

* `localCompare(..)`: function that compares two strings according to the current locale (useful for sorting); returns a negative number (usually `-1` but not guaranteed) if the original string value is comes before the argument string value lexicographically, a positive number (usually `1` but not guaranteed) if the original string value comes after the argument string value lexicographically, and `0` if the two strings are identical

* `anchor()`, `big()`, `blink()`, `bold()`, `fixed()`, `fontcolor()`, `fontsize()`, `italics()`, `link()`, `small()`, `strike()`, `sub()`, and `sup()`: historically, these were useful in generating HTML string snippets; they're now deprecated and should be avoided

| WARNING: |
| :--- |
| Many of the methods described above rely on position indices. As mentioned earlier in the "Length Computation" section, these positions are dependent on the internal contents of the string value, which means that if an extended Unicode character is present and takes up two code-unit slots, that will count as two index positions instead of one. Failing to account for *decomposed* code-units, surrogate pairs, and grapheme cluseters is a common source of bugs in JS string handling. |

These string methods can all be called directly on a literal value, or on a variable/property that's holding a string value. When applicable, they produce a new string value rather than modifying the existing string value (since strings are immutable):

```js
"all these letters".toUpperCase();      // ALL THESE LETTERS

greeting = "Hello!";
greeting.repeat(2);                     // Hello!Hello!
greeting;                               // Hello!
```

### Static `String` Helpers

The following string utility functions are proviced directly on the `String` object, rather than as methods on individual string values:

* `String.fromCharCode(..)` / `String.fromCodePoint(..)`: produce a string from one or more arguments representing the code-units (`fromCharCode(..)`) or whole code-points (`fromCodePoint(..)`)

* `String.raw(..)`: a default template-tag function that allows interpolation on a template literal but prevents character escape sequences from being parsed, so they remain in their *raw* individual input characters from the literal

Moreover, most values (especially primitives) can be explicitly coerced to their string equivalent by passing them to the `String(..)` function (no `new` keyword). For example:

```js
String(true);           // "true"
String(42);             // "42"
String(Infinity);       // "Infinity"
String(undefined);      // "undefined"
```

We'll cover much more detail about such type coercions in a later chapter.

## Number Behaviors

Numbers are used for a variety of tasks in our programs, but mostly for mathematical computations. Pay close attention to how JS numbers behave, to ensure the outcomes are as expected.

### Floating Point Imprecision

We need to revisit our discussion of IEEE-754 from Chapter 1.

One of the classic gotchas of any IEEE-754 number system in any programming language -- NOT UNIQUELY JS! -- is that not all operations and values can fit neatly into the IEEE-754 representations.

The most common illustration is:

```js
point3a = 0.1 + 0.2;
point3b = 0.3;

point3a;                        // 0.30000000000000004
point3b;                        // 0.3

point3a === point3b;            // false <-- oops!
```

The operation `0.1 + 0.2` ends up creating floating-point error (drift), where the value stored is actually `0.30000000000000004`.

The respective bit representations are:

```
// 0.30000000000000004
00111111110100110011001100110011
00110011001100110011001100110100

// 0.3
00111111110100110011001100110011
00110011001100110011001100110011
```

If you look closely at those bit patterns, only the last 2 bits differ, from `00` to `11`. But that's enough for those two numbers to be unequal!

Again, just to reinforce: this behavior is **NOT IN ANY WAY** unique to JS. This is exactly how any IEEE-754 conforming programming language will work in the same scenario. As I asserted above, the majority of all programming languages use IEEE-754, and thus they will all suffer this same fate.

The temptation to make fun of JS for `0.1 + 0.2 !== 0.3` is strong, I know. But here it's completely bogus.

| NOTE: |
| :--- |
| Pretty much all programmers need to be aware of IEEE-754 and make sure they are careful about these kinds of gotchas. It's somewhat amazing, in a disappointing way, how few of them have any idea how IEEE-754 works. If you've taken your time reading and understanding these concepts so far, you're now in that rare tiny percentage who actually put in the effort to understand the numbers in their programs! |

#### Epsilon Threshold

A common piece of advice to work around such floating-point imprecision uses this *very small* `number` value defined by JS:

```js
Number.EPSILON;                 // 2.220446049250313e-16
```

*Epsilon* is the smallest difference JS can represent between `1` and the next value greater than `1`. While this value is technically implementation/platform dependent, it's generally about `2.2E-16`, or `2^-52`.

To those not paying close enough attention to the details here -- including my past self! -- it's generally assumed that any skew in floating point precision from a single operation should never be greater than `Number.EPSILON`. Thus, in theory, we can use `Number.EPSILON` as a *very small* tolerance value to ensure number equality comparisons are *safe*:

```js
function safeNumberEquals(a,b) {
    return Math.abs(a - b) < Number.EPSILON;
}

point3a = 0.1 + 0.2;
point3b = 0.3;

// are these safely "equal"?
safeNumberEquals(point3a,point3b);      // true
```

| WARNING: |
| :--- |
| In the first edition "Types & Grammar" book, I indeed recommended exactly this approach. I was wrong. I should have researched the topic more closely. |

But, it turns out, this approach isn't safe at all:

```js
point3a = 10.1 + 0.2;
point3b = 10.3;

safeNumberEquals(point3a,point3b);      // false :(
```

Well... that's a bummer!

Unfortunately, `Number.EPSILON` only works as a "safely equal" error threshold for certain small numbers/operations, and in other cases, it's far too small, and yields false negatives.

You could scale `Number.EPSILON` by some factor to produce a larger threshold that avoids false negatives but still filters out all the floating point skew in your program. But what factor to use is entirely a manual judgement call based on what magnitude of values, and operations on them, your program will entail. There's no automatic way to compute a reliable, universal threshold.

Unless you really know what you're doing, you should just *not* use this `Number.EPSILON` threshold approach at all.

| TIP: |
| :--- |
| If you'd like to read more details and solid advice on this topic, I highly recommend reading this post. [^EpsilonBad] But if we can't use `Number.EPSILON` to avoid the perils of floating-point skew, what do we do? If you can avoid floating-point altogether by scaling all your numbers up so they're all whole number integers (or bigints) while performing math, do so. Only deal with decimal values when you have to output/represent a final value after all the math is done. If that's not possible/practical, use an arbitrary precision decimal emulation library and avoid `number` values entirely. Or do your math in another external programming environment that's not based on IEEE-754. |

### Numeric Comparison

Like strings, number values can be compared (for both equality and relational ordering) using the same operators.

Remember that no matter what form the number value takes when being specified as a literal (base-10, octal, hexadecimal, exponential, etc), the underlying value stored is what will be compared. Also keep in mind the floating point imprecision issues discussed in the previous section, as the comparisons will be sensitive to the exact binary contents.

#### Numeric Equality

Just like strings, equality comparisons for numbers use either the `==` / `===` operators or `Object.is(..)`. Also recall that if the types of both operands are the same, `==` performs identically to `===`.

```js
42 == 42;                   // true
42 === 42;                  // true

42 == 43;                   // false
42 === 43;                  // false

Object.is(42,42);           // true
Object.is(42,43);           // false
```

For `==` coercive equality (when the operand types don't match), if either operand is not a string value, `==` prefers a numeric equality check (meaning both operands are coerced to numbers).

```js
// numeric (not string!) comparison
42 == "42";                 // true
```

In this snippet, the coercive equality coerces `"42"` to `42`, not vice versa (`42` to `"42"`). Once both types are `number`, then their values are compared for exact equality, the same as `===` would.

Recall that JS doesn't distinguish between values like `42`, `42.0`, and `42.000000`; under the covers, they're all the same. Unsurpisingly, the `==` and `===` equality checks verify that:

```js
42 == 42.0;                 // true
42.0 == 42.00000;           // true
42.00 === 42.000;           // true
```

The intuition you likely have is, if two numbers are literally the same, they're equal. And that's how JS interprets it. But `0.3` is not literally the same as the result of `0.1 + 0.2`, because (as we saw earlier), the latter produces an underlying value that's *very close* to `0.3`, but is not exactly identical.

What's interesting is, the two values are *so close* that their difference is less than the `Number.EPSILON` threshold, so JS can't actually represent that difference *accurately*.

You might then think, at least informally, that such JS numbers should be "equal", since the difference between them is too small to represent. But notice: JS *can* represent that there *is* a difference, which is why you see that `4` at the very end of the decimal when JS evaluates `0.1 + 0.2`. And you *could* type out the number literal `0.00000000000000004` (aka, `4e-17`), being that difference between `0.3` and `0.1 + 0.2`.

What JS cannot do, with its IEEE-754 floating point numbers, is represent a number that small in an *accurate* enough way that operations on it produce expected results. It's too small to be fully and properly represented in the `number` type JS provides.

So `0.1 + 0.2 == 0.3` resolves to `false`, because there's a difference between the two values, even though JS can't accurately represent or do anything with a value as small as that difference.

Also like we saw with strings, the `!=` (coercive not-equal) and `!==` (strict-not-equal) operators work with numbers. `x != y` is basically `!(x == y)`, and `x !== y` is basically `!(x === y)`.

There are two frustrating exceptions in numeric equality (whether you use `==` or `===`):

```js
NaN === NaN;                // false -- ugh!
-0 === 0;                   // true -- ugh!
```

`NaN` is never equal to itself (even with `===`), and `-0` is always equal to `0` (even with `===`). It sometimes surprises folks that even `===` has these two exceptions in it.

However, the `Object.is(..)` equality check has neither of these exceptions, so for equality comparisons with `NaN` and `-0`, avoid the `==` / `===` operators and use `Object.is(..)` -- or for `NaN` specifically, `Number.isNaN(..)`.

#### Numeric Relational Comparisons

Just like with string values, the JS relational operators (`<`, `<=`, `>`, and `>=`) operate with numbers. The `<` (less-than) and `>` (greater-than) operations should be fairly self explanatory:

```js
41 < 42;                    // true

0.1 + 0.2 > 0.3;            // true (ugh, IEEE-754)
```

Remember: just like `==`, the `<` and `>` operators are also coercive, meaning that any non-number values are coerced to numbers -- unless both operands are already strings, as we saw earlier. There are no strict relational comparison operators.

If you're doing relational comparisons between numbers, the only way to avoid coercion is to ensure that the comparisons always have two numbers. Otherwise, these operators will do *coercive relational* comparisons similar to how `==` performs *coercive equality* comparisons.

### Mathematical Operators

As I asserted earlier, the main reason to have numbers in a programming language is to perform mathematical operations with them. So let's talk about how we do so.

The basic arithmetic operators are `+` (addition), `-` (subtraction), `*` (multiplication), and `/` (division). Also available are the operators `**` (exponentiation) and `%` (modulo, aka *division remainder*). There are also `+=`, `-=`, `*=`, `/=`, `**=`, and `%=` forms of the operators, which additionally assign the result back to the left operand -- must be a valid assignment target like a variable or property.

| NOTE: |
| :--- |
| As we've already seen, the `+` operator is overloaded to work with both numbers and strings. When one or both operands is a string, the result is a string concatenation (including coercing either operand to a string if necessary). But if neither operand is a string, the result is a numeric addition, as expected. |

All these mathematical operators are *binary*, meaning they expect two value operands, one on either side of the operator; they all expect the operands to be number values. If either or both operands are non-numbers, the non-number operand(s) is/are coerced to numbers to perform the operation. We'll cover coercion in detail in a later chapter.

Consider:

```js
40 + 2;                 // 42
44 - 2;                 // 42
21 * 2;                 // 42
84 / 2;                 // 42
7 ** 2;                 // 49
49 % 2;                 // 1

40 + "2";               // "402" (string concatenation)
44 - "2";               // 42 (because "2" is coerced to 2)
21 * "2";               // 42 (..ditto..)
84 / "2";               // 42 (..ditto..)
"7" ** "2";             // 49 (both operands are coerced to numbers)
"49" % "2";             // 1 (..ditto..)
```

The `+` and `-` operators also come in a *unary* form, meaning they only have one operand; again, the operand is expected to be a number, and coerced to a number if not:

```js
+42;                    // 42
-42;                    // -42

+"42";                  // 42
-"42";                  // -42
```

You might have noticed that `-42` looks like it's just a "negative forty-two" numeric literal. That's not quite right. A nuance of JS syntax is that it doesn't recognize negative numeric literals. Instead, JS treats this as a positive numeric literal `42` that's preceded, and negated, by the unary `-` operator in front of it.

Somewhat surprisingly, then:

```js
-42;                    // -42
- 42;                   // -42
-
    42;                 // -42
```

As you can see, whitespace (and even new lines) are allowed between the `-` unary operator and its operand; actually, this is true of all operators and operands.

#### Increment and Decrement

There are two other unary numeric operators: `++` (increment) and `--` decrement. They both perform their respective operation and then reassign the result to the operand -- must be a valid assignment target like a variable or property.

You may sort of think of `++` as equivalent to `+= 1`, and `--` as equivalent to `-= 1`:

```js
myAge = 42;

myAge++;
myAge;                  // 43

numberOfHeadHairs--;
```

However, these are special operators in that they can appear in a postfix (after the operand) position, as above, or in a prefix (before the operand) position:

```js
myAge = 42;

++myAge;
myAge;                  // 43

--numberofHeadHairs;
```

It may seem peculiar that prefix and postfix positions seem to give the same result (incrementing or decrementing) in such examples. The difference is subtle, and isn't related to the final reassigned result. We'll revisit these particular operators in a later chapter to dig into the positional differences.

### Bitwise Operators

JS provides several bitwise operators to perform bit-level operations on number values.

However, these bit operations are not performed against the packed bit-pattern of IEEE-754 numbers (see Chapter 1). Instead, the operand number is first converted to a 32-bit signed *integer*, the bit operation is performed, and then the result is converted back into an IEEE-754 number.

Keep in mind, just like any other primitive operators, these just compute new values, not actually modifying a value in place.

* `&` (bitwise AND): Performs an AND operation with each corresponding bit from the two operands; `42 & 36 === 32` (i.e., `0b00...101010 & 0b00...100100 === 0b00..100000`)

* `|` (bitwise OR): Performs an OR operation with each corresponding bit from the two operands; `42 | 36 === 46` (i.e., `0b00...101010 | 0b00...100100 === 0b00...101110`)

* `^` (bitwise XOR): Performs an XOR (eXclusive-OR) operation with each corresponding bit from the two operands; `42 ^ 36 === 14` (i.e., `0b00...101010 ^ 0b00...100100 === 0b00...001110`)

* `~` (bitwise NOT): Performs a NOT operation against the bits of a single operand; `~42 === -43` (i.e., `~0b00...101010 === 0b11...010101`); using 2's complement, the signed integer has the first bit set to `1` meaning negative, and the rest of the bits (when flipped back, according to 2's complement, which is 1's complement bit flipping and then adding `1`) would be `43` (`0b10...101011`); the equivalent of `~` in decimal number arithmetic is `~x === -(x + 1)`, so `~42 === -43`

* `<<` (left shift): Performs a left-shift of the bits of the left operand by the count of bits specified by the right operand; `42 << 3 == 336` (i.e., `0b00...101010 << 3 === 0b00...101010000`)

* `>>` (right shift): Performs a sign-propagating right-shift of the bits of the left operand by the count of bits specified by the right operand, discarding the bits that fall off the right side; whatever the leftmost bit is (`0`, or `1` is negative) is copied in as bits on the left (thereby preserving the sign of the original value in the result); `42 >> 3 === 5` (i.e., `0b00..101010 >> 3 === 0b00...000101`)

* `>>>` (zero-fill right shift, aka unsigned right shift): Performs the same right-shift as `>>`, but `0` fills on the bits shifted in from the left side instead of copying the leftmost bit (thereby ignoring the sign of the original value in the result); `42 >>> 3 === 5` but `-43 >>> 3 === 536870906` (i.e., `0b11...010101 >>> 3 === 0b0001...111010`)

* `&=`, `|=`, `<<=`, `>>=`, and `>>>=` (bitwise operators with assignment): Performs the corresponding bitwise operation, but then assigns the result to the left operand (which must be a valid assignment target, like a variable or property, not just a literal value); note that `~=` is missing from the list, because there is no such "binary negate with assignment" operator

In all honesty, bitwise operations are not very common in JS. But you may sometimes see a statement like:

```js
myGPA = 3.54;

myGPA | 0;              // 3
```

Since the bitwise operators act only on 32-bit integers, the `| 0` operation truncates (i.e., `Math.trunc(..)`) any decimal value, leaving only the integer.

| WARNING: |
| :--- |
| A common misconception is that `| 0` is like *floor* (i.e., `Math.floor(..)`). The result of `| 0` agrees with `Math.floor(..)` on positive numbers, but differs on negative numbers, because by standard definition, *floor* is an operation that rounds-down towards `-Infinity`. `| 0` merely discards the decimal bits, which is in fact truncation. |

### Number Value Methods

Number values provide the following methods (as properties) for number-specific operations:

* `toExponential(..)`: produces a string representation of the number using scientific notation (e.g., `"4.2e+1"`)

* `toFixed(..)`: produces a non-scientific-notation string representation of the number with the specified number of decimal places (rounding or zero-padding as necessary)

* `toPrecision(..)`: like `toFixed(..)`, except it applies the numeric argument as the number of significant digits (i.e., precision) including both the whole number and decimal places if any

* `toLocaleString(..)`: produces a string representation of the number according to the current locale

```js
myAge = 42;

myAge.toExponential(3);         // "4.200e+1"
```

One particular nuance of JS syntax is that `.` can be ambiguous when dealing with number literals and property/method access.

If a `.` comes immediately (no whitespace) after a numeric literal digit, and there's not already a `.` decimal in the number value, the `.` is assumed to be a starting the decimal portion of the number. But if the position of the `.` is unambiguously *not* part of the numeric literal, then it's always treated as a property access.

```js
42 .toExponential(3);           // "4.200e+1"
```

Here, the whitespace disambiguates the `.`, designating it as a property/method access. It's perhaps more common/preferred to use `(..)` instead of whitespace for such disambiguation:

```js
(42).toExponential(3);          // "4.200e+1"
```

An unusual-looking effect of this JS parsing grammar rule:

```js
42..toExponential(3);           // "4.200e+1"
```

So called the "double-dot" idiom, the first `.` in this expression is a decimal, and thus the second `.` is unambiguously *not* a decimal, but rather a property/method access.

Also, notice there's no digits after the first `.`; it's perfectly legal syntax to leave a trailing `.` on a numeric literal:

```js
myAge = 41. + 1.;

myAge;                          // 42
```

Values of `bigint` type cannot have decimals, so the parsing is unambiguous that a `.` after a literal (with the trailing `n`) is always a property access:

```js
42n.toString();                 // 42
```

### Static `Number` Properties

* `Number.EPSILON`: The smallest value possible between `1` and the next highest number

* `Number.NaN`: The same as the global `NaN` symbol, the special invalid number

* `Number.MIN_SAFE_INTEGER` / `Number.MAX_SAFE_INTEGER`: The positive and negative integers with the largest absolute value (furthest from `0`)

* `Number.MIN_VALUE` / `Number.MAX_VALUE`: The minimum (positive value closest to `0`) and the maximum (positive value furthest from `0`) representable by the `number` type

* `Number.NEGATIVE_INFINITY` / `Number.POSITIVE_INFINITY`: Same as global `-Infinity` and `Infinity`, the values that represent the largest (non-finite) values furthest from `0`

### Static `Number` Helpers

* `Number.isFinite(..)`: returns a boolean indicating if the value is finite -- a `number` that's not `NaN`, nor one of the two infinities

* `Number.isInteger(..)` / `Number.isSafeInteger(..)`: both return booleans indicating if the value is a whole `number` with no decimal places, and if it's within the *safe* range for integers (`-2^53 + 1` - `2^53 - 1`)

* `Number.isNaN(..)`: The bug-fixed version of the global `isNaN(..)` utility, which identifies if the argument provided is the special `NaN` value

* `Number.parseFloat(..)` / `Number.parseInt(..)`: utilties to parse string values for numeric digits, left-to-right, until the end of the string or the first non-float (or non-integer) character is encountered

### Static `Math` Namespace

Since the main usage of `number` values is for performing mathematical operations, JS includes many standard mathematical constants and operation utilities on the `Math` namespace.

There's a bunch of these, so I'll omit listing every single one. But here's a few for illustration purposes:

```js
Math.PI;                        // 3.141592653589793

// absolute value
Math.abs(-32.6);                // 32.6

// rounding
Math.round(-32.6);              // -33

// min/max selection
Math.min(100,Math.max(0,42));   // 42
```

Unlike `Number`, which is also the `Number(..)` function (for number coercion), `Math` is just an object that holds these properties and static function utilities; it cannot be called as a function.

| WARNING: |
| :--- |
| One peculiar member of the `Math` namespace is `Math.random()`, for producing a random floating point value between `0` and `1.0`. It's unusual to consider random number generation -- a task that's inherently stateful/side-effect'ing -- as a mathematical operation. It's also long been a footgun security-wise, as the pseudo-random number generator (PRNG) that JS uses is *not* secure (can be predicted) from a cryptography perspective. The web platform stepped in several years ago with the safer `crypto.getRandomValues(..)` API (based on a better PRNG), which fills a typed-array with random bits that can be interpreted as one or more integers (of type-specified maximum magnitude). Using `Math.random()` is universally discouraged now. |

### BigInts and Numbers Don't Mix

As we covered in Chapter 1, values of `number` type and `bigint` type cannot mix in the same operations. That can trip you up even if you're doing a simple increment of the value (like in a loop):

```js
myAge = 42n;

myAge + 1;                  // TypeError thrown!
myAge += 1;                 // TypeError thrown!

myAge + 1n;                 // 43n
myAge += 1n;                // 43n

myAge++;
myAge;                      // 44n
```

As such, if you're using both `number` and `bigint` values in your programs, you'll need to manually coerce one value-type to the other somewhat regularly. The `BigInt(..)` function (no `new` keyword) can coerce a `number` value to `bigint`. Vice versa, to go the other direction from `bigint` to `number`, use the `Number(..)` function (again, no `new` keyword):

```js
BigInt(42);                 // 42n

Number(42n);                // 42
```

Keep in mind though: coercing between these types has some risk:

```js
BigInt(4.2);                // RangeError thrown!
BigInt(NaN);                // RangeError thrown!
BigInt(Infinity);           // RangeError thrown!

Number(2n ** 1024n);        // Infinity
```

## Primitives Are Foundational

Over the last two chapters, we've dug deep into how primitive values behave in JS. I bet more than a few readers were, like me, ready to skip over these topics. But now, hopefully, you see the importance of understanding these concepts.

The story doesn't end here, though. Far from it! In the next chapter, we'll turn our attention to understanding JS's object types (objects, arrays, etc).

[^TwitterUnicode]: "New update to the Twitter-Text library: Emoji character count"; Andy Piper; Oct 2018; https://twittercommunity.com/t/new-update-to-the-twitter-text-library-emoji-character-count/114607 ; Accessed July 2022

[^INTLAPI]: ECMAScript 2022 Internationalization API Specification; https://402.ecma-international.org/9.0/ ; Accessed August 2022

[^INTLCollator]: "Intl.Collator", MDN; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator ; Accessed August 2022

[^INTLSegmenter]: "Intl.Segmenter", MDN; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter ; Accessed August 2022

[^StrictEquality]: "7.2.16 IsStrictlyEqual(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-isstrictlyequal ; Accessed August 2022

[^LooseEquality]: "7.2.15 IsLooselyEqual(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-islooselyequal ; Accessed August 2022

[^EpsilonBad]: "PLEASE don't follow the code recipe in the accepted answer", Stack Overflow; Daniel Scott; July 2019; https://stackoverflow.com/a/56967003/228852 ; Accessed August 2022
# You Don't Know JS Yet: Types & Grammar - 2nd Edition
# Chapter 3: Object Values

| NOTE: |
| :--- |
| Work in progress |

Now that we're comfortable with the built-in primitive types, we turn our attention to the `object` types in JS.

I could write a whole book talking about objects in-depth; in fact, I already did! The "Objects & Classes" title of this series covers objects in-depth already, so make sure you've read that before continuing with this chapter.

Rather than repeat that book's content, here we'll focus our attention on how the `object` value-type behaves and interacts with other values in JS.

## Types of Objects

The `object` value-type comprises several sub-types, each with specialized behaviors, including:

* plain objects
* fundamental objects (boxed primitives)
* built-in objects
* arrays
* regular expressions
* functions (aka, "callable objects")

Beyond the specialized behaviors, one shared characteristic is that all objects can act as collections (of properties) holding values (including functions/methods).

## Plain Objects

The general object value-type is sometimes referred to as *plain ol' javascript objects* (POJOs).

Plain objects have a literal form:

```js
address = {
    street: "12345 Market St",
    city: "San Francisco",
    state: "CA",
    zip: "94114"
};
```

This plain object (POJO), as defined with the `{ .. }` curly braces, is a collection of named properties (`street`, `city`, `state`, and `zip`). Properties can hold any values, primitives or other objects (including arrays, functions, etc).

The same object could also have been defined imperatively using the `new Object()` constructor:

```js
address = new Object();
address.street = "12345 Market St";
address.city = "San Francisco";
address.state = "CA";
address.zip = "94114";
```

Plain objects are by default `[[Prototype]]` linked to `Object.prototype`, giving them delegated access to several general object methods, such as:

* `toString()` / `toLocaleString()`
* `valueOf()`
* `isPrototypeOf(..)`
* `hasOwnProperty(..)` (recently deprecated -- alternative: static `Object.hasOwn(..)` utility)
* `propertyIsEnumerable(..)`
* `__proto__` (getter function)

```js
address.isPrototypeOf(Object.prototype);    // true
address.isPrototypeOf({});                  // false
```

## Fundamental Objects

JS defines several *fundamental* object types, which are instances of various built-in constructors, including:

* `new String()`
* `new Number()`
* `new Boolean()`

Note that these constructors must be used with the `new` keyword to construct instances of the fundamental objects. Otherwise, these functions actually perform type coercion (see Chapter 4).

These fundamental object constructors create object value-types instead of a primitives:

```js
myName = "Kyle";
typeof myName;                      // "string"

myNickname = new String("getify");
typeof myNickname;                  // "object"
```

In other words, an instance of a fundamental object constructor can actually be seen as a wrapper around the corresponding underlying primitive value.

| WARNING: |
| :--- |
| It's nearly universally regarded as *bad practice* to ever directly instantiate these fundamental objects. The primitive counterparts are generally more predictable, more performant, and offer *auto-boxing* (see "Automatic Objects" section below) whenever the underlying object-wrapper form is needed for property/method access. |

The `Symbol(..)` and `BigInt(..)` functions are referred to in the specification as "constructors", though they're not used with the `new` keyword, and the values they produce in a JS program are indeed primitives.

How, there are internal *fundamental objects* for these two types, used for prototype delegation and *auto-boxing*.

By contrast, for `null` and `undefined` primitive values, there aren't `Null()` or `Undefined()` "constructors", nor corresponding fundamental objects or prototypes.

### Prototypes

Instances of the fundamental object constructors are `[[Prototype]]` linked to their constructors' `prototype` objects:

* `String.prototype`: defines `length` property, as well as string-specific methods, like `toUpperCase()`, etc.

* `Number.prototype`: defines number-specific methods, like `toPrecision(..)`, `toFixed(..)`, etc.

* `Boolean.prototype`: defines default `toString()` and `valueOf()` methods.

* `Symbol.prototype`: defines `description` (getter), as well as default `toString()` and `valueOf()` methods.

* `BigInt.prototype`: defines default `toString()`, `toLocaleString()`, and `valueOf()` methods.

Any direct instance of the built-in constructors have `[[Prototype]]` delegated access to its respective `prototype` properties/methods. Moreover, corresponding primitive values also have such delegated access, by way of *auto-boxing*.

### Automatic Objects

I've mentioned *auto-boxing* several times (including Chapters 1 and 2, and a few times so far in this chapter). It's finally time for us to explain that concept.

Accessing a property or method on a value requires that the value be an object. As we've already seen in Chapter 1, primitives *are not* objects, so JS needs to then temporarily convert/wrap such a primitive to its fundamental object counterpart[^AutoBoxing] to perform that access.

For example:

```js
myName = "Kyle";

myName.length;              // 4

myName.toUpperCase();       // "KYLE"
```

Accessing the `length` property or the `toUpperCase()` method, is only allowed on a primitive string value because JS *auto-boxes* the primitive `string` into a wrapper fundamental object, an instance of `new String(..)`. Otherwise, all such accesses would have to fail, since primitives do not have any properties.

More importantly, when the primitive value is *auto-boxed* to its fundamental object counterpart, those internally created objects have access to predefined properties/methods (like `length` and `toUpperCase()`) via a `[[Prototype]]` link to their respective fundamental object's prototype.

So an *auto-boxed* `string` is an instance of `new String()`, and is thus linked to `String.prototype`. Further, the same is true of `number` (wrapped as an instance of `new Number()`) and `boolean` (wrapped as an instance of `new Boolean()`).

Even though the `Symbol(..)` and `BigInt(..)` "constructors" (used without `new`produce primitive values, these primitive values can also be *auto-boxed* to their internal fundamental object wrapper forms, for the purposes of delegated access to properties/methods.

| NOTE: |
| :--- |
| See the "Objects & Classes" book of this series for more on `[[Prototype]]` linkages and delegated/inherited access to the fundamental object constructors' prototype objects. |

Since `null` and `undefined` have no corresponding fundamental objects, there is no *auto-boxing* of these values.

A subjective question to consider: is *auto-boxing* a form of coercion? I say it is, though some disagree. Internally, a primitive is converted to an object, meaning a change in value-type has occurred. Yes, it's temporary, but plenty of coercions are temporary. Moreover, the conversion is rather *implicit* (implied by the property/method access, but only happens internally). We'll revisit the nature of coercion in Chapter 4.

## Other Built-in Objects

In addition to fundamental object constructors, JS defines a number of other built-in constructors that create further specialized object sub-types:

* `new Date(..)`
* `new Error(..)`
* `new Map(..)`, `new Set(..)`, `new WeakMap(..)`, `new WeakSet(..)` -- keyed collections
* `new Int8Array(..)`, `new Uint32Array(..)`, etc -- indexed, typed-array collections
* `new ArrayBuffer(..)`, `new SharedArrayBuffer(..)`, etc -- structured data collections

## Arrays

Arrays are objects that are specialized to behave as numerically indexed collections of values, as opposed to holding values at named properties like plain objects do.

Arrays have a literal form:

```js
favoriteNumbers = [ 3, 12, 42 ];

favoriteNumbers[2];                 // 42
```

The same array could also have been defined imperatively using the `new Array()` constructor:

```js
favoriteNumbers = new Array();
favoriteNumbers[0] = 3;
favoriteNumbers[1] = 12;
favoriteNumbers[2] = 42;
```

Arrays are `[[Prototype]]` linked to `Array.prototype`, giving them delegated access to a variety of array-oriented methods, such as `map(..)`, `includes(..)`, etc:

```js
favoriteNumbers.map(v => v * 2);
// [ 6, 24, 84 ]

favoriteNumbers.includes(42);       // true
```

Some of the methods defined on `Array.prototype` -- for example, `push(..)`, `pop(..)`, `sort(..)`, etc -- behave by modifying the array value in place. Other methods -- for example, `concat(..)`, `map(..)`, `slice(..)` -- behave by creating a new array to return, leaving the original array intact. A third category of array functions -- for example, `indexOf(..)`, `includes(..)`, etc -- merely computes and returns a (non-array) result.

## Regular Expressions

// TODO

## Functions

// TODO

## Proposed: Records/Tuples

At the time of this writing, a (stage-2) proposal[^RecordsTuplesProposal] exists to add a new set of features to JS, which correspond closely to plain objects and arrays, but with some notable differences.

Records are similar to plain objects, but are immutable (sealed, read-only), and (unlike objects) are treated as primitive values, for the purposes of value assignment and equality comparison. The syntax difference is a `#` before the `{ }` delimiter. Records can only contain primitive values (including records and tuples).

Tuples have exactly the same relationship, but to arrays, including the `#` before the `[ ]` delimiters.

It's important to note that while these look and seem like objects/arrays, they are indeed primitive (non-object) values.

[^FundamentalObjects]: "20 Fundamental Objects", EcamScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-fundamental-objects ; Accessed August 2022

[^AutoBoxing]: "6.2.4.6 PutValue(V,W)", Step 5.a, ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-putvalue ; Accessed August 2022

[^RecordsTuplesProposal]: "JavaScript Records & Tuples Proposal"; Robin Ricard, Rick Button, Nicolò Ribaudo;
https://github.com/tc39/proposal-record-tuple ; Accessed August 2022
# You Don't Know JS Yet: Types & Grammar - 2nd Edition
# Chapter 4: Coercing Values

| NOTE: |
| :--- |
| Work in progress |

We've thoroughly covered all of the different *types* of values in JS. And along the way, more than a few times, we mentioned the notion of converting -- actually, coercing -- from one type of value to another.

In this chapter, we'll dive deep into coercion and uncover all its mysteries.

## Coercion: Explicit vs Implicit

Some developers assert that when you explicitly indicate a type change in an operation, this doesn't qualify as a *coercion* but just a type-cast or type-conversion. In other words, the claim is that coercion is only implicit.

I disagree with this characterization. I use *coercion* to label any type conversion in a dynamically-typed language, whether it's plainly obvious in the code or not. Here's why: the line between *explicit* and *implicit* is not clear and objective, it's fairly subjective. If you think a type conversion is implicit (and thus *coercion*), but I think it's explicit (and thus not a *coercion*), the distinction becomes irrelevant.

Keep that subjectivity in mind as we explore various *explicit* and *implicit* forms of coercion. In fact, here's a spoiler: most of the coercions could be argued as either, so we'll be looking at them with such balanced perspective.

### Implicit: Bad or ...?

An extremely common opinion among JS developers is that *coercion is bad*, specifically, that *implicit coercion is bad*; the rise in popularity of type-aware tooling like TypeScript speaks loudly to this sentiment.

But that feeling is not new. 14+ years ago, Douglas Crockford's book "The Good Parts" also famously decried *implicit coercion* as one of the *bad parts*. Even Brendan Eich, creator of JS, regularly claims that *implicit coercion* was a mistake[^EichCoercion] in the early design of the language that he now regrets.

If you've been around JS for more than a few months, you've almost certainly heard these opinions voiced strongly and predominantly. And if you've been around JS for years or more, you probably have your mind already made up.

In fact, I think you'd be hard pressed to name hardly any other well-known source of JS teaching that strongly endorses coercion (in virtually all its forms); I do -- and this book definitely does! -- but I feel mostly like a lone voice shouting futilely in the wilderness.

However, here's an observation I've made over the years: most of the folks who publicly condemn *implicit coercion*, actually use *implicit coercion* in their own code. Hmmmm...

Douglas Crockford says to avoid the mistake of *implicit coercion*[^CrockfordCoercion], but his code uses `if (..)` statements with non-boolean values evaluated. [^CrockfordIfs] Many have dismissed my pointing that out in the past, with the claim that conversion-to-boolean isn't *really* coercion. Ummm... ok?

Brendan Eich says he regrets *implicit coercion*, but yet he openly endorses[^BrendanToString] idioms like `x + ""` (and others!) to coerce the value in `x` to a string (we'll cover this later); and that's most definitely an *implicit coercion*.

So what do we make of this dissonance? Is it merely a, "do as I say, not as I do" minor self-contradiction? Or is there more to it?

I am not going to pass a final judgement here yet, but I want you the reader to deeply ponder that question, as you continue throughout this chapter and book.

## Abstracts

Now that I've challenged you to examine coercion in more depth than you may have ever previously indulged, let's first look at the foundations of how coercion occurs, according to the JS specification.

The specification details a number of *abstract operations*[^AbstractOperations] that dictate internal conversion from one value-type to another. It's important to be aware of these operations, as coercive mechanics in the language mix and match them in various ways.

These operations *look* as if they're real functions that could be called, such as `ToString(..)` or `ToNumber(..)`. But by *abstract*, we mean they only exist conceptually by these names; they aren't functions we can *directly* invoke in our programs. Instead, we activate them implicitly/indirectly depending on the statements/expressions in our programs.

### ToBoolean

Decision making (conditional branching) always requires a boolean `true` or `false` value. But it's extremely common to want to make these decisions based on non-boolean value conditions, such as whether a string is empty or has anything in it.

When non-boolean values are encountered in a context that requires a boolean -- such as the condition clause of an `if` statement or `for` loop -- the `ToBoolean(..)`[^ToBoolean] abstract operation is activated to facilitate the coercion.

All values in JS are in one of two buckets: *truthy* or *falsy*. Truthy values coerce via the `ToBoolean()` operation to `true`, whereas falsy values coerce to `false`:

```
// ToBoolean() is abstract

ToBoolean(undefined);               // false
ToBoolean(null);                    // false
ToBoolean("");                      // false
ToBoolean(0);                       // false
ToBoolean(-0);                      // false
ToBoolean(0n);                      // false
ToBoolean(NaN);                     // false
```

Simple rule: *any other value* that's not in the above list is truthy and coerces via `ToBoolean()` to `true`:

```
ToBoolean("hello");                 // true
ToBoolean(42);                      // true
ToBoolean([ 1, 2, 3 ]);             // true
ToBoolean({ a: 1 });                // true
```

Even values like `"   "` (string with only whitespace), `[]` (empty array), and `{}` (empty object), which may seem intuitively like they're more "false" than "true", nevertheless coerce to `true`.

| WARNING: |
| :--- |
| There *are* narrow, tricky exceptions to this truthy rule. For example, the web platform has deprecated the long-standing `document.all` collection/array feature, though it cannot be removed entirely -- that would break too many sites. Even where `document.all` is still defined, it behaves as a "falsy object"[^ExoticFalsyObjects] -- `undefined` which then coerces to `false`; this means legacy conditional checks like `if (document.all) { .. }` no longer pass. |

The `ToBoolean()` coercion operation is basically a lookup table rather than an algorithm of steps to use in coercions a non-boolean to a boolean. Thus, some developers assert that this isn't *really* coercion the way other abstract coercion operations are. I think that's bogus. `ToBoolean()` converts from non-boolean value-types to a boolean, and that's clear cut type coercion (even if it's a very simple lookup instead of an algorithm).

Keep in mind: these rules of boolean coercion only apply when `ToBoolean()` is actually activated. There are constructs/idioms in the JS language that may appear to involve boolean coercion but which don't actually do so. More on these later.

### ToPrimitive

Any value that's not already a primitive can be reduced to a primitive using the `ToPrimitive()` (specifically, `OrdinaryToPrimitive()`[^OrdinaryToPrimitive]) abstract operation.  Generally, the `ToPrimitive()` is given a *hint* to tell it whether a `number` or `string` is preferred.

```
// ToPrimitive() is abstract

ToPrimitive({ a: 1 },"string");          // "[object Object]"

ToPrimitive({ a: 1 },"number");          // NaN
```

The `ToPrimitive()` operation will look on the object provided, for either a `toString()` method or a `valueOf()` method; the order it looks for those is controlled by the *hint*. `"string"` means check in `toString()` / `valueOf()` order, whereas `"number"` (or no *hint*) means check in `valueOf()` / `toString()` order.

If the method returns a value matching the *hinted* type, the operation is finished. But if the method doesn't return a value of the *hinted* type, `ToPrimitive()` will then look for and invoke the other method (if found).

If the attempts at method invocation fail to produce a value of the *hinted* type, the final return value is forcibly coerced via the corresponding abstract operation: `ToString()` or `ToNumber()`.

### ToString

Pretty much any value that's not already a string can be coerced to a string representation, via `ToString()`. [^ToString] This is usually quite intuitive, especially with primitive values:

```
// ToString() is abstract

ToString(42.0);                 // "42"
ToString(-3);                   // "-3"
ToString(Infinity);             // "Infinity"
ToString(NaN);                  // "NaN"
ToString(42n);                  // "42"

ToString(true);                 // "true"
ToString(false);                // "false"

ToString(null);                 // "null"
ToString(undefined);            // "undefined"
```

There are *some* results that may vary from common intuition. As mentioned in Chapter 2, very large or very small numbers will be represented using scientific notation:

```
ToString(Number.MAX_VALUE);     // "1.7976931348623157e+308"
ToString(Math.EPSILON);         // "2.220446049250313e-16"
```

Another counter-intuitive result comes from `-0`:

```
ToString(-0);                   // "0" -- wtf?
```

This isn't a bug, it's just an intentional behavior from the earliest days of JS, based on the assumption that developers generally wouldn't want to ever see a negative-zero output.

One primitive value-type that is *not allowed* to be coerced (implicitly, at least) to string is `symbol`:

```
ToString(Symbol("ok"));         // TypeError exception thrown
```

| WARNING: |
| :--- |
| Calling the `String()`[^StringFunction] concrete function (without `new` operator) is generally thought of as *merely* invoking the `ToString()` abstract operation. While that's mostly true, it's not entirely so. `String(Symbol("ok"))` works, whereas the abstract `ToString(Symbol(..))` itself throws an exception. More on `String(..)` later in this chapter. |

#### Default `toString()`

When `ToString()` is activated with an object value-type, it delegates to the `ToPrimitive()` operation (as explained earlier), with `"string"` as its *hinted* type:

```
ToString(new String("abc"));        // "abc"
ToString(new Number(42));           // "42"

ToString({ a: 1 });                 // "[object Object]"
ToString([ 1, 2, 3 ]);              // "1,2,3"
```

By virtue of `ToPrimitive(..,"string")` delegation, these objects all have their default `toString()` method (inherited via `[[Prototype]]`) invoked.

### ToNumber

Non-number values *that resemble* numbers, such as numeric strings, can generally be coerced to a numeric representation, using `ToNumber()`: [^ToNumber]

```
// ToNumber() is abstract

ToNumber("42");                     // 42
ToNumber("-3");                     // -3
ToNumber("1.2300");                 // 1.23
ToNumber("   8.0    ");             // 8
```

If the full value doesn't *completely* (other than whitespace) resemble a valid number, the result will be `NaN`:

```
ToNumber("123px");                  // NaN
ToNumber("hello");                  // NaN
```

Other primitive values have certain designated numeric equivalents:

```
ToNumber(true);                     // 1
ToNumber(false);                    // 0

ToNumber(null);                     // 0
ToNumber(undefined);                // NaN
```

There are some rather surprising designations for `ToNumber()`:

```
ToNumber("");                       // 0
ToNumber("       ");                // 0
```

| NOTE: |
| :--- |
| I call these "surprising" because I think it would have made much more sense for them to coerce to `NaN`, the way `undefined` does. |

Some primitive values are *not allowed* to be coerced to numbers, and result in exceptions rather than `NaN`:

```
ToNumber(42n);                      // TypeError exception thrown
ToNumber(Symbol("42"));             // TypeError exception thrown
```

| WARNING: |
| :--- |
| Calling the `Number()`[^NumberFunction] concrete function (without `new` operator) is generally thought of as *merely* invoking the `ToNumber()` abstract operation to coerce a value to a number. While that's mostly true, it's not entirely so. `Number(42n)` works, whereas the abstract `ToNumber(42n)` itself throws an exception. |

#### Other Abstract Numeric Conversions

In addition to `ToNumber()`, the specification defines `ToNumeric()`, which activates `ToPrimitive()` on a value, then conditionally delegates to `ToNumber()` if the value is *not* already a `bigint` value-type.

There are also a wide variety of abstract operations related to converting values to very specific subsets of the general `number` type:

* `ToIntegerOrInfinity()`
* `ToInt32()`
* `ToUint32()`
* `ToInt16()`
* `ToUint16()`
* `ToInt8()`
* `ToUint8()`
* `ToUint8Clamp()`

Other operations related to `bigint`:

* `ToBigInt()`
* `StringToBigInt()`
* `ToBigInt64()`
* `ToBigUint64()`

You can probably infer the purpose of these operations from their names, and/or from consulting their algorithms in the specification. For most JS operations, it's more likely that a higher-level operation like `ToNumber()` is activated, rather than these specific ones.

#### Default `valueOf()`

When `ToNumber()` is activated on an object value-type, it instead delegates to the `ToPrimitive()` operation (as explained earlier), with `"number"` as its *hinted* type:

```
ToNumber(new String("abc"));        // NaN
ToNumber(new Number(42));           // 42

ToNumber({ a: 1 });                 // NaN
ToNumber([ 1, 2, 3 ]);              // NaN
ToNumber([]);                       // 0
```

By virtue of `ToPrimitive(..,"number")` delegation, these objects all have their default `valueOf()` method (inherited via `[[Prototype]]`) invoked.

### Equality Comparison

When JS needs to determine if two values are the *same value*, it activates the `SameValue()`[^SameValue] operation, which delegates to a variety of related sub-operations.

This operation is very narrow and strict, and performs no coercion or any other special case exceptions. If two values are *exactly* the same, the result is `true`, otherwise it's `false`:

```
// SameValue() is abstract

SameValue("hello","\x68ello");          // true
SameValue("\u{1F4F1}","\uD83D\uDCF1");  // true
SameValue(42,42);                       // true
SameValue(NaN,NaN);                     // true

SameValue("\u00e9","\u0065\u0301");     // false
SameValue(0,-0);                        // false
SameValue([1,2,3],[1,2,3]);             // false
```

A variation of these operations is `SameValueZero()` and its associated sub-operations. The main difference is that these operations treat `0` and `-0` as indistinguishable.

```
// SameValueZero() is abstract

SameValueZero(0,-0);                    // true
```

If the values are numeric (`number` or `bigint`), `SameValue()` and `SameValueZero()` both delegate to sub-operations of the same names, specialized for each `number` and `bigint` type, respectively.

Otherwise, `SameValueNonNumeric()` is the sub-operation delegated to if the values being compared are both non-numeric:

```
// SameValueNonNumeric() is abstract

SameValueNonNumeric("hello","hello");   // true

SameValueNonNumeric([1,2,3],[1,2,3]);   // false
```

#### Higher-Abstracted Equality

Different from `SameValue()` and its variations, the specification also defines two important higher-abstraction abstract equality comparison operations:

* `IsStrictlyEqual()`[^StrictEquality]
* `IsLooselyEqual()`[^LooseEquality]

The `IsStrictlyEqual()` operation immediately returns `false` if the value-types being compared are different.

If the value-types are the same, `IsStrictlyEqual()` delegates to sub-operations for comparing `number` or `bigint` values. [^NumericAbstractOps] You might logically expect these delegated sub-operations to be the aforementioned numeric-specialized `SameValue()` / `SameValueZero()` operations. However, `IsStrictlyEqual()` instead delegates to `Number:equal()`[^NumberEqual] or `BigInt:equal()`[^BigIntEqual].

The difference between `Number:SameValue()` and `Number:equal()` is that the latter defines corner cases for `0` vs `-0` comparison:

```
// all of these are abstract operations

Number:SameValue(0,-0);             // false
Number:SameValueZero(0,-0);         // true
Number:equal(0,-0);                 // true
```

These operations also differ in `NaN` vs `NaN` comparison:

```
Number:SameValue(NaN,NaN);          // true
Number:equal(NaN,NaN);              // false
```

| WARNING: |
| :--- |
| So in other words, despite its name, `IsStrictlyEqual()` is not quite as "strict" as `SameValue()`, in that it *lies* when comparisons of `-0` or `NaN` are involved. |

The `IsLooselyEqual()` operation also inspects the value-types being compared; if they're the same, it immediately delegates to `IsStrictlyEqual()`.

But if the value-types being compared are different, `IsLooselyEqual()` performs a variety of *coercive equality* steps. It's important to note that this algorithm is always trying to reduce the comparison down to where both value-types are the same (and it tends to prefer `number` / `bigint`).

The steps of the *coercive equality* portion of the algorithm can roughly be summarized as follows:

1. If either value is `null` and the other is `undefined`, `IsLooselyEqual()` returns `true`. In other words, this algorithm applies *nullish* equality, in that `null` and `undefined` are coercively equal to each other (and to no other values).

2. If either value is a `number` and the other is a `string`, the `string` value is coerced to a `number` via `ToNumber()`.

3. If either value is a `bigint` and the other is a `string`, the `string` value is coerced to a `bigint` via `StringToBigInt()`.

4. If either value is a `boolean`, it's coerced to a `number`.

5. If either value is a non-primitive (object, etc), it's coerced to a primitive with `ToPrimitive()`; though a *hint* is not explicitly provided, the default behavior will be as if `"number"` was the hint.

Each time a coercion is performed in the above steps, the algorithm is *recursively* reactivated with the new value(s). That process continues until the types are the same, and then the comparison is delegated to the `IsStrictlyEqual()` operation.

What can we take from this algorithm? First, we see there is a bias toward `number` (or `bigint`) comparison; it never coerce values to `string` or `boolean` value-types.

Importantly, we see that both `IsLooselyEqual()` and `IsStrictlyEqual()` are type-sensitive. `IsStrictlyEqual()` immediately bails if the types mismatch, whereas `IsLooselyEqual()` performs the extra work to coerce mismatching value-types to be the same value-types (again, ideally, `number` or `bigint`).

Moreover, if/once the types are the same, both operations are identical -- `IsLooselyEqual()` delegates to `IsStrictlyEqual()`.

### Relational Comparison

When values are compared relationally -- that is, is one value "less than" another? -- there's one specific abstract operation that is activated: `IsLessThan()`. [^LessThan]

```
// IsLessThan() is abstract

IsLessThan(1,2, /*LeftFirst=*/ true );            // true
```

There is no `IsGreaterThan()` operation; instead, the first two arguments to `IsLessThan()` can be reversed to accomplish a "greater than" comparison. To preserve left-to-right evaluation semantics (in the case of nuanced side-effects), `isLessThan()` also takes a third argument (`LeftFirst`); if `false`, this indicates a comparison was reversed and the second parameter should be evaluated before the first.

```
IsLessThan(1,2, /*LeftFirst=*/ true );            // true

// equivalent of a fictional "IsGreaterThan()"
IsLessThan(2,1, /*LeftFirst=*/ false );          // false
```

Similar to `IsLooselyEqual()`, the `IsLessThan()` operation is *coercive*, meaning that it first ensures that the value-types of its two values match, and prefers numeric comparisons. There is no `IsStrictLessThan()` for non-coercive relational comparison.

As an example of coercive relational comparison, if the type of one value is `string` and the type of the other is `bigint`, the `string` is coerced to a `bigint` with the aforementioned `StringToBigInt()` operation. Once the types are the same, `IsLessThan()` proceeds as described in the following sections.

#### String Comparison

When both value are type `string`, `IsLessThan()` checks to see if the lefthand value is a prefix (the first *n* characters[^StringPrefix]) of the righthand; if so, `true` is returned.

If neither string is a prefix of the other, the first character position (start-to-end direction, not left-to-right) that's different between the two strings, is compared for their respective code-unit (numeric) values; the result is then returned.

Generally, code-units follow intuitive lexicographic (aka, dictionary) order:

```
IsLessThan("a","b", /*LeftFirst=*/ true );        // true
```

Even digits are treated as characters (not numbers):

```
IsLessThan("101","12", /*LeftFirst=*/ true );     // true
```

There's even a bit of embedded *humor* in the unicode code-unit ordering:

```
IsLessThan("🐔","🥚", /*LeftFirst=*/ true );      // true
```

At least now we've answered the age old question of *which comes first*?!

#### Numeric Comparison

For numeric comparisons, `IsLessThan()` defers to either the `Number:lessThan()` or `BigInt:lessThan()` operation[^NumericAbstractOps], respectively:

```
IsLessThan(41,42, /*LeftFirst=*/ true );         // true

IsLessThan(-0,0, /*LeftFirst=*/ true );          // false

IsLessThan(NaN,1 /*LeftFirst=*/ true );          // false

IsLessThan(41n,42n, /*LeftFirst=*/ true );       // true
```

## Concrete Coercions

Now that we've covered all the abstract operations JS defines for handling various coercions, it's time to turn our attention to the concrete statements/expressions we can use in our programs that activate these operations.

### To Boolean

To coerce a value that's not of type `boolean` into that type, we need the abstract `ToBoolean()` operation, as described earlier in this chapter.

Before we explore *how* to activate it, let's discuss *why* you would want to force a `ToBoolean()` coercion.

From a code readability perspective, being *explicit* about type coercions can be preferable (though not universally). But functionally, the most common reason to force a `boolean` is when you're passing data to an external source -- for example, submitting data as JSON to an API endpoint -- and that location expects `true` / `false` without needing to do coercions.

There's several ways that `ToBoolean()` can be activated. Perhaps the most *explicit* (obvious) is the `Boolean(..)` function:

```js
Boolean("hello");               // true
Boolean(42);                    // true

Boolean("");                    // false
Boolean(0);                     // false
```

As mentioned in Chapter 3, keep in mind that `Boolean(..)` is being called without the `new` keyword, to activate the `ToBoolean()` abstract operation.

It's not terribly common to see JS developers use the `Boolean(..)` function for such explicit coercions. More often, developers will use the double-`!` idiom:

```js
!!"hello";                      // true
!!42;                           // true

!!"";                           // false
!!0;                            // false
```

The `!!` is not its own operator, even though it seems that way. It's actually two usages of the unary `!` operator. This operator first coerces any non-`boolean`, then negates it. To undo the negation, the second `!` flips it back.

So... which of the two, `Boolean(..)` or `!!`, do you consider to be more of an explicit coercion?

Given the flipping that `!` does, which must then be undone with another `!`, I'd say `Boolean(..)` is *more* explicit -- at the job of coercing a non-`boolean` to a `boolean` -- than `!!` is. But surveying open-source JS code, the `!!` is used far more often.

If we're defining *explicit* as, "most directly and obviously performing an action", `Boolean(..)` edges out `!!`. But if we're defining *explicit* as, "most recognizably performing an action", `!!` might have the edge. Is there a definitive answer here?

While you're pondering that question, let's look at another JS mechanism that activates `ToBoolean()` under the covers:

```js
specialNumber = 42;

if (specialNumber) {
    // ..
}
```

The `if` statement requires a `boolean` for the conditional to make its control-flow decision. If you pass it a non-`boolean`, a `ToBoolean()` *coercion* is performed.

Unlike previous `ToBoolean()` coercion expressions, like `Boolean(..)` or `!!`, this `if` coercion is ephemeral, in that our JS program never sees the result of the coercion; it's just used internally by the `if`. Some may feel it's not *really* coercion if the program doesn't preserve/use the value. But I strongly disagree, because the coercion most definitely affects the program's behavior.

Many other statement types also activate the `ToBoolean()` coercion, including the `? :` ternary conditional, and `for` / `while` loops. We also have `&&` (logical-AND) and `||` (logical-OR) operators. For example:

```js
isLoggedIn = user.sessionID || req.cookie["Session-ID"];

isAdmin = isLoggedIn && ("admin" in user.permissions);
```

For both operators, the lefthand expression is first evaluated; if it's not already a `boolean`, a `ToBoolean()` coercion is activated to produce a value for the conditional decision.

| NOTE: |
| :--- |
| To briefly explain these operators: for `||`, if the lefthand expression value (post-coercion, if necessary) is `true`, the pre-coercion value is returned; otherwise the righthand expression is evaluated and returned (no coercion). For `&&`, if the lefthand expression value (post-coercion, if necessary) is `false`, the pre-coercion value is returned; otherwise, the righthand expression is evaluated and returned (no coercion). In other words, both `&&` and `||` force a `ToBoolean()` coercion of the lefthand operand for making the decision, but neither operator's final result is actually coerced to a `boolean`. |

In the previous snippet, despite the naming implications, it's unlikely that `isLoggedIn` will actually be a `boolean`; and if it's truthy, `isAdmin` also won't be a `boolean`. That kind of code is quite common, but it's definitely dangerous that the assumed resultant `boolean` types aren't actually there. We'll revisit this example, and these operators, in the next chapter.

Are these kinds of statements/expressions (e.g., `if (..)`, `||`, `&&`, etc) illustrating *explicit* coercion or *implicit* coercion in their conditional decision making?

Again, I think it depends on your perspective. The specification dictates pretty explicitly that they only make their decisions with `boolean` conditional values, requiring coercion if a non-`boolean` is received. On the other hand, a strong argument can also be made that any internal coercion is a secondary (implicit) effect to the main job of `if` / `&&` / etc.

Further, as mentioned earlier in the `ToBoolean()` discussion, some folks don't consider *any* activation of `ToBoolean()` to be a coercion.

I think that's too much of a stretch, though. My take: `Boolean(..)` is the most preferable *explicit* coercion form. I think `!!`, `if`, `for`, `while`, `&&`, and `||` are all *implicitly* coercing non-`boolean`s, but I'm OK with that.

Since most developers, including famous names like Doug Crockford, also in practice use implicit (`boolean`) coercions in their code[^CrockfordIfs], I think we can say that at least *some forms* of *implicit* coercion are widely acceptable, regardless of the ubiquitous rhetoric to the contrary.

### To String

As with `ToBoolean()`, there are a number of ways to activate the `ToString()` coercion (as discussed earlier in the chapter). The decision of which approach is similarly subjective.

Like the `Boolean(..)` function, the `String(..)` function (no `new` keyword) is a primary way of activating *explicit* `ToString()` coercion:

```js
String(true);                   // "true"
String(42);                     // "42"
String(-0);                     // "0"
String(Infinity);               // "Infinity"

String(null);                   // "null"
String(undefined);              // "undefined"
```

However, `String(..)` is more than *just* an activation of `ToString()`. For example:

```js
String(Symbol("ok"));           // "Symbol(ok)"
```

This works, because *explicit* coercion of `symbol` values is allowed. But in cases where a symbol is *implicitly* coerced to a string (e.g., `Symbol("ok") + ""`), the underlying `ToString()` operation throws an exception. That proves that `String(..)` is more than just an activation of `ToString()`. More on *implicit* string coercion of symbols in a bit.

If you call `String(..)` with an object value (e.g., array, etc), it activates the `ToPrimitive()` operation (via the `ToString()` operation), which then looks for an invokes that value's `toString()` method:

```js
String([1,2,3]);                // "1,2,3"

String(x => x + 1);             // "x => x + 1"
```

Aside from `String(..)`, any primitive, non-nullish value (neither `null` nor `undefined`) can be auto-boxed (see Chapter 3) in its respective object wrapper, providing a callable `toString()` method.

```js
true.toString();                // "true"
42..toString();                 // "42"
-0..toString();                 // "0"
Infinity.toString();            // "Infinity"
Symbol("ok").toString();        // "Symbol(ok)"
```

| NOTE: |
| :--- |
| Do keep in mind, these `toString()` methods do *not* necessarily activate the `ToString()` operation, they just define their own rules for how to represent the value as a string. |

As shown with `String(..)` just a moment ago, the various object sub-types -- such as arrays, functions, regular expressions, `Date` and `Error` instances, etc -- all define their own specific `toString()` methods, which can be invoked directly:

```js
[1,2,3].toString();             // "1,2,3"

(x => x + 1).toString();        // "x => x + 1"
```

Moreover, any plain object that's (by default) `[[Prototype]]` linked to `Object.prototype` has a default `toString()` method available:

```js
({ a : 1 }).toString();         // "[object Object]"
```

Is the `toString()` approach to coercion *explicit* or *implicit*? Again, it depends. It's certainly a self-descriptive mechanism, which leans *explicit*. But it often relies on auto-boxing, which is itself a fairly *implicit* coercion.

Let's take a look at another common -- and famously endorsed! -- idiom for coercing a value to a string. Recall from "String Concatenation" in Chapter 2, the `+` operator is overloaded to prefer string concatenation if either operand is already a string, and thus coerces non-string operand to a string if necessary.

Consider:

```js
true + "";                      // "true"
42 + "";                        // "42"
null + "";                      // "null"
undefined + "";                 // "undefined"
```

The `+ ""` idiom for string coercion takes advantage of the `+` overloading, without altering the final coerced string value. By the way, all of these work the same with the operands reversed (i.e., `"" + ..`).

| WARNING: |
| :--- |
| An extremely common misconception is that `String(x)` and `x + ""` are basically equivalent coercions, respectively just *explicit* vs *implicit* in form. But, that's not quite true! We'll revisit this in the "To Primitive" section later in this chapter. |

Some feel this is an *explicit* coercion, but I think it's clearly more *implicit*, in that it's taking advantage of the `+` overloading; further, the `""` is indirectly used to activate the coercion without modifying it. Moreover, consider what happens when this idiom is applied with a symbol value:

```js
Symbol("ok") + "";              // TypeError exception thrown
```

| WARNING: |
| :--- |
| Allowing *explicit* coercion of symbols (`String(Symbol("ok"))`, but disallowing *implicit* coercion (`Symbol("ok") + ""`), is quite intentional by TC39. [^SymbolString] It was felt that symbols, as primitives often used in places where strings are otherwise used, could too easily be mistaken as strings. As such, they wanted to make sure developers expressed intent to coerce a symbol to a string, hopefully avoiding many of those anticipated confusions. This is one of the *extremely rare* cases where the language design asserts an opinion on, and actually discriminates between, *explicit* vs. *implicit* coercions. |

Why the exception? JS treats `+ ""` as an *implicit* coercion, which is why when activated with a symbol, an exception is thrown. I think that's a pretty ironclad proof.

Nevertheless, as I mentioned at the start of this chapter, Brendan Eich endorses `+ ""`[^BrendanToString] as the *best* way to coerce values to strings. I think that carries a lot of weight, in terms of him supporting at least a subset of *implicit* coercion practices. His views on *implicit* coercion must be a bit more nuanced than, "it's all bad."

### To Number

Numeric coercions are a bit more complicated than string coercions, since we can be talking about either `number` or `bigint` as the target type. There's also a much smaller set of values that can be validly represented numerically (everything else becomes `NaN`).

Let's start with the `Number(..)` and `BigInt(..)` functions (no `new` keywords):

```js
Number("42");                   // 42
Number("-3.141596");            // -3.141596
Number("-0");                   // -0

BigInt("42");                   // 42n
BigInt("-0");                   // 0n
```

`Number` coercion which fails (not recognized) results in `NaN` (see "Invalid Number" in Chapter 1), whereas `BigInt` throws an exception:

```js
Number("123px");                // NaN

BigInt("123px");
// SyntaxError: Cannot convert 123px to a BigInt
```

Moreover, even though `42n` is valid syntax as a literal `bigint`, the string `"42n"` is never a recognized string representation of a `bigint`, by either of the coercive function forms:

```js
Number("42n");                  // NaN

BigInt("42n");
// SyntaxError: Cannot convert 42n to a BigInt
```

However, we *can* coerce numeric strings with other representations of the numbers than typical base-10 decimals (see Chapter 1 for more information):

```js
Number("0b101010");             // 42

BigInt("0b101010");             // 42n
```

Typically, `Number(..)` and `BigInt(..)` receive string values, but that's not actually required. For example, `true` and `false` coerce to their typical numeric equivalents:

```js
Number(true);                   // 1
Number(false);                  // 0

BigInt(true);                   // 1n
BigInt(false);                  // 0n
```

You can also generally coerce between `number` and `bigint` types:

```js
Number(42n);                    // 42
Number(42n ** 1000n);           // Infinity

BigInt(42);                     // 42n
```

We can also use the `+` unary operator, which is commonly assumed to coerce the same as the `Number(..)` function:

```js
+"42";                          // 42
+"0b101010";                    // 42
```

Be careful though. If the coercions are unsafe/invalid in certain ways, exceptions are thrown:

```js
BigInt(3.141596);
// RangeError: The number 3.141596 cannot be converted to a BigInt

+42n;
// TypeError: Cannot convert a BigInt value to a number
```

Clearly, `3.141596` does not safely coerce to an integer, let alone a `bigint`.

But `+42n` throwing an exception is an interesting case. By contrast, `Number(42n)` works fine, so it's a bit surprising that `+42n` fails.

| WARNING: |
| :--- |
| That surprise is especially palpable since prepending a `+` in front of a number is typically assumed to just mean a "positive number", the same way `-` in front a number is assumed to mean a "negative number". As explained in Chapter 1, however, JS numeric syntax (`number` and `bigint`) recognize no syntax for "negative values". All numeric literals are parsed as "positive" by default. If a `+` or `-` is prepended, those are treated as unary operators applied against the parsed (positive) number. |

OK, so `+42n` is parsed as `+(42n)`. But still... why is `+` throwing an exception here?

You might recall earlier when we showed that JS allows *explicit* string coercion of symbol values, but disallows *implicit* string coercions? The same thing is going on here. JS language design interprets unary `+` in front of a `bigint` value as an *implicit* `ToNumber()` coercion (thus disallowed!), but `Number(..)` is interpreted as an *explicit* `ToNumber()` coercion (thus allowed!).

In other words, contrary to popular assumption/assertion, `Number(..)` and `+` are not interchangable. I think `Number(..)` is the safer/more reliable form.

#### Mathematical Operations

Mathematical operators (e.g., `+`, `-`, `*`, `/`, `%`, and `**`) expect their operands to be numeric. If you use a non-`number` with them, that value will be coerced to a `number` for the purposes of the mathematical computation.

Similar to how `x + ""` is an idiom for coercing `x` to a string, an expression like `x - 0` safely coerces `x` to a number.

| WARNING: |
| :--- |
| `x + 0` isn't quite as safe, since the `+` operator is overloaded to perform string concatenation if either operand is already a string. The `-` minus operator isn't overloaded like that, so the only coercion will be to `number`. Of course, `x * 1`, `x / 1`, and even `x ** 1` would also generally be equivalent mathematically, but those are much less common, and probably should be avoided as likely confusing to readers of your code. Even `x % 1` seems like it should be safe, but it can introduce floating-point skew (see "Floating Point Imprecision" in Chapter 2). |

Regardless of what mathematical operator is used, if the coercion fails, a `NaN` is the result, and all of these operators will propagate the `NaN` out as their result.

#### Bitwise Operations

Bitwise operators (e.g., `|`, `&`, `^`, `>>`, `<<`, and `<<<`) all expect number operands, but specifically they clamp these values to 32-bit integers.

If you're sure the numbers you're dealing with are safely within the 32-bit integer range, `x | 0` is another common expression idiom that has the effect of coercing `x` to a `number` if necessary.

Moreover, since JS engines know these values will be integers, there's potential for them to optimize for integer-only math if they see `x | 0`. This is one of several recommended "type annotations" from the ASM.js[^ASMjs] efforts from years ago.

#### Property Access

Property access of objects (and index access of arrays) is another place where implicit coercion can occur.

Consider:

```js
myObj = {};

myObj[3] = "hello";
myObj["3"] = "world";

console.log( myObj );
```

What do you expect from the contents of this object? Do you expect two different properties, numeric `3` (holding `"hello"`) and string `"3"` (holding `"world"`)? Or do you think both properties are in the same location?

If you try that code, you'll see that indeed we get an object with a single property, and it holds the `"world"` value. That means that JS is internally coercing either the `3` to `"3"`, or vice versa, when those properties accesses are made.

Interestingly, the developer console may very well represent the object sort of like this:

```js
console.log( myObj );
// {3: 'world'}
```

Does that `3` there indicate the property is a numeric `3`? Not quite. Try adding another property to `myObj`:

```js
myObj.something = 42;

console.log( myObj )
// {3: 'world', something: 42}
```

We can see that this developer console doesn't quote string property keys, so we can't infer anything from `3` versus if the console had used `"3"` for the key name.

Let's instead try consulting the specification for the object value[^ObjectValue], where we find:

> A property key value is either an ECMAScript String value or a Symbol value. All String and Symbol values, including the empty String, are valid as property keys. A property name is a property key that is a String value.

OK! So, in JS, objects only hold string (or symbol) properties. That must mean that the numeric `3` is coerced to a string `"3"`, right?

In the same section of the specification, we further read:

> An integer index is a String-valued property key that is a canonical numeric String (see 7.1.21) and whose numeric value is either +0𝔽 or a positive integral Number ≤ 𝔽(253 - 1). An array index is an integer index whose numeric value i is in the range +0𝔽 ≤ i < 𝔽(232 - 1).

If a property key (like `"3"`) *looks* like a number, it's treated as an integer index. Hmmm... that almost seems to suggest the opposite of what we just posited, right?

Nevertheless, we know from the previous quote that property keys are *only* strings (or symbols). So it must be that "integer index" here is not describing the actual location, but rather the intentional usage of `3` in JS code, as a developer-expressed "integer index"; JS must still then actually store it at the location of the "canonical numeric String".

Consider attempts to use other value-types, like `true`, `null`, `undefined`, or even non-primitives (other objects):

```js
myObj[true] = 100;
myObj[null] = 200;
myObj[undefined] = 300;
myObj[ {a:1} ] = 400;

console.log(myObj);
// {3: 'world', something: 42, true: 100, null: 200,
// undefined: 300, [object Object]: 400}
```

As you can see, all of those other value-types were coerced to strings for the purposes of object property names.

But before we convince ourselves of this interpretation that everything (even numbers) is coerced to strings, let's look at an array example:

```js
myArr = [];

myArr[3] = "hello";
myArr["3"] = "world";

console.log( myArr );
// [empty × 3, 'world']
```

The developer console will likely represent an array a bit differently than a plain object. Nevertheless, we still see that this array only has the single `"world"` value in it, at the numeric index position corresponding to `3`.

That kind of output sort of implies the opposite of our previous interpretation: that the values of an array are being stored only at numeric positions. If we add another string property-name to `myArr`:

```js
myArr.something = 42;
console.log( myArr );
// [empty × 3, 'world', something: 42]
```

Now we see that this developer console represents the numerically indexed positions in the array *without* the property names (locations), but the `something` property is named in the output.

It's also true that JS engines like v8 tend to, for performance optimization reasons, special-case object properties that are numeric-looking strings as actually being stored in numeric positions as if they were arrays. So even if the JS program acts as if the property name is `"3"`, in fact under the covers, v8 might be treating it as if coerced to `3`!

What can take from all this?

The specification clearly tells us that the behavior of object properties is for them to be treated like strings (or symbols). That means we can assume that using `3` to access a location on an object will have the internal effect of coercing that property name to `"3"`.

But with arrays, we observe a sort of opposite semantic: using `"3"` as a property name has the effect of accessing the numerically indexed `3` position, as if the string was coerced to the number. But that's mostly just an offshot of the fact that arrays always tend to behave as numerically indexed, and/or perhaps a reflection of underlying implementation/optimization details in the JS engine.

The important part is, we need to recognize that objects cannot simply use any value as a property name. If it's anything other than a string or a number, we can expect that there *will be* a coercion of that value.

We need to expect and plan for that rather than allowing it to surprise us with bugs down the road!

### To Primitive

Most operators in JS, including those we've seen with coercions to `string` and `number`, are designed to run against primitive values. When any of these operators is used instead against an object value, the abstract `ToPrimitive` algorithm (as described earlier) is activated to coerce the object to a primitive.

Let's set up an object we can use to inspect how different operations behave:

```js
spyObject = {
    toString() {
        console.log("toString() invoked!");
        return "10";
    },
    valueOf() {
        console.log("valueOf() invoked!");
        return 42;
    },
};
```

This object defines both the `toString()` and `valueOf()` methods, and each one returns a different type of value (`string` vs `number`).

Let's try some of the coercion operations we've already seen:

```js
String(spyObject);
// toString() invoked!
// "10"

spyObject + "";
// valueOf() invoked!
// "42"
```

Whoa! I bet that surprised a few of you readers; it certainly did me. It's so common for people to assert that `String(..)` and `+ ""` are equivalent forms of activating the `ToString()` operation. But they're clearly not!

The difference comes down to the *hint* that each operation provides to `ToPrimitive()`. `String(..)` clearly provides `"string"` as the *hint*, whereas the `+ ""` idiom provides no *hint* (similar to *hinting* `"number"`). But don't miss this detail: even though `+ ""` invokes `valueOf()`, when that returns a `number` primitive value of `42`, that value is then coerced to a string (via `ToString()`), so we get `"42"` instead of `42`.

Let's keep going:

```js
Number(spyObject);
// valueOf() invoked!
// 42

+spyObject;
// valueOf() invoked!
// 42
```

This example implies that `Number(..)` and the unary `+` operator both perform the same `ToPrimitive()` coercion (with *hint* of `"number"`), which in our case returns `42`. Since that's already a `number` as requested, the value comes out without further ado.

But what if a `valueOf()` returns a `bigint`?

```js
spyObject2 = {
    valueOf() {
        console.log("valueOf() invoked!");
        return 42n;  // bigint!
    }
};

Number(spyObject2);
// valueOf() invoked!
// 42     <--- look, not a bigint!

+spyObject2;
// valueOf() invoked!
// TypeError: Cannot convert a BigInt value to a number
```

We saw this difference earlier in the "To Number" section. JS allows an *explicit* coercion of the `42n` bigint value to the `42` number value, but it disallows what it considers to be an *implicit* coercion form.

What about the `BigInt(..)` (no `new` keyword) coercion function?

```js
BigInt(spyObject);
// valueOf() invoked!
// 42n    <--- look, a bigint!

BigInt(spyObject2);
// valueOf() invoked!
// 42n

// *******************************

spyObject3 = {
    valueOf() {
        console.log("valueOf() invoked!");
        return 42.3;
    }
};

BigInt(spyObject3);
// valueOf() invoked!
// RangeError: The number 42.3 cannot be converted to a BigInt
```

Again, as we saw in the "To Number" section, `42` can safely be coerced to `42n`. On the other hand, `42.3` cannot safely be coerced to a `bigint`.

We've seen that `toString()` and `valueOf()` are invoked, variously, as certain `string` and `number` / `bigint` coercions are performed.

#### No Primitive Found?

If `ToPrimitive()` fails to produce a primitive value, an exception will be thrown:

```js
spyObject4 = {
    toString() {
        console.log("toString() invoked!");
        return [];
    },
    valueOf() {
        console.log("valueOf() invoked!");
        return {};
    }
};

String(spyObject4);
// toString() invoked!
// valueOf() invoked!
// TypeError: Cannot convert object to primitive value

Number(spyObject4);
// valueOf() invoked!
// toString() invoked!
// TypeError: Cannot convert object to primitive value
```

If you're going to define custom to-primitive coercions via `toString()` / `valueOf()`, make sure to return a primitive from at least one of them!

#### Object To Boolean

What about `boolean` coercions of objects?

```js
Boolean(spyObject);
// true

!spyObject;
// false

if (spyObject) {
    console.log("if!");
}
// if!

result = spyObject ? "ternary!" : "nope";
// "ternary!"

while (spyObject) {
    console.log("while!");
    break;
}
// while!
```

Each of these are activating `ToBoolean()`. But if you recall from earlier, *that* algorithm never delegates to `ToPrimitive()`; thus, we don't see "valueOf() invoked!" being logged out.

#### Unboxing: Wrapper To Primitive

A special form of objects that are often `ToPrimitive()` coerced: boxed/wrapped primitives (as seen in Chapter 3). This particular object-to-primitive coercion is often referred to as *unboxing*.

Consider:

```js
hello = new String("hello");
String(hello);                  // "hello"
hello + "";                     // "hello"

fortyOne = new Number(41);
Number(fortyOne);               // 41
fortyOne + 1;                   // 42
```

The object wrappers `hello` and `fortyOne` above have `toString()` and `valueOf()` methods configured on them, to behave similarly to the `spyObject` / etc objects from our previous examples.

A special case to be careful of with wrapped-object primitives is with `Boolean()`:

```js
nope = new Boolean(false);
Boolean(nope);                  // true   <--- oops!
!!nope;                         // true   <--- oops!
```

Remember, this is because `ToBoolean()` does *not* reduce an object to its primitive form with `ToPrimitive`; it merely looks up the value in its internal table, and since normal (non-exotic[^ExoticFalsyObjects]) objects are always truthy, `true` comes out.

| NOTE: |
| :--- |
| It's a nasty little gotcha. A case could certainly be made that `new Boolean(false)` should configure itself internally as an exotic "falsy object". [^ExoticFalsyObjects] Unfortunately, that change now, 25 years into JS's history, could easily create breakage in programs. As such, JS has left this gotcha untouched. |

#### Overriding Default `toString()`

As we've seen, you can always define a `toString()` on an object to have *it* invoked by the appropriate `ToPrimitive()` coercion. But another option is to override the `Symbol.toStringTag`:

```js
spyObject5a = {};
String(spyObject5a);
// "[object Object]"
spyObject5a.toString();
// "[object Object]"

spyObject5b = {
    [Symbol.toStringTag]: "my-spy-object"
};
String(spyObject5b);
// "[object my-spy-object]"
spyObject5b.toString();
// "[object my-spy-object]"

spyObject5c = {
    get [Symbol.toStringTag]() {
        return `myValue:${this.myValue}`;
    },
    myValue: 42
};
String(spyObject5c);
// "[object myValue:42]"
spyObject5c.toString();
// "[object myValue:42]"
```

`Symbol.toStringTag` is intended to define a custom string value to describe the object whenever its default `toString()` operation is invoked directly, or implicitly via coercion; in its absence, the value used is `"Object"` in the common `"[object Object]"` output.

The `get ..` syntax in `spyObject5c` is defining a *getter*. That means when JS tries to access this `Symbol.toStringTag` as a property (as normal), this getter code instead causes the function we specify to be invoked to compute the result. We can run any arbitrary logic inside this getter to dynamically determine a string *tag* for use by the default `toString()` method.

#### Overriding `ToPrimitive`

You can alternately override the whole default `ToPrimitive()` operation for any object, by setting the special symbol property `Symbol.toPrimitive` to hold a function:

```js
spyObject6 = {
    [Symbol.toPrimitive](hint) {
        console.log(`toPrimitive(${hint}) invoked!`);
        return 25;
    },
    toString() {
        console.log("toString() invoked!");
        return "10";
    },
    valueOf() {
        console.log("valueOf() invoked!");
        return 42;
    },
};

String(spyObject6);
// toPrimitive(string) invoked!
// "25"   <--- not "10"

spyObject6 + "";
// toPrimitive(default) invoked!
// "25"   <--- not "42"

Number(spyObject6);
// toPrimitive(number) invoked!
// 25     <--- not 42 or "25"

+spyObject6;
// toPrimitive(number) invoked!
// 25
```

As you can see, if you define this function on an object, it's used entirely in replacement of the default `ToPrimitive()` abstract operation. Since `hint` is still provided to this invoked function (`[Symbol.toPrimitive](..)`), you could in theory implement your own version of the algorithm, invoking a `toString()`, `valueOf()`, or any other method on the object (`this` context reference).

Or you can just manually define a return value as shown above. Regardless, JS will *not* automatically invoke either `toString()` or `valueOf()` methods.

| WARNING: |
| :--- |
| As discussed prior in "No Primitive Found?", if the defined `Symbol.toPrimitive` function does not actually return a value that's a primitive, an exception will be thrown about being unable to "...convert object to primitive value". Make sure to always return an actual primitive value from such a function! |

### Equality

Thus far, the coercions we've seen have been focused on single values. We turn out attention now to equality comparisons, which inherently involve two values, either or both of which may be subject to coercion.

Earlier in this chapter, we talked about several abstract operations for value equality comparison.

For example, the `SameValue()` operation[^SameValue] is the strictest of the equality comparisons, with absolutely no coercion. The most obvious JS operation that relies on `SameValue()` is:

```js
Object.is(42,42);                   // true
Object.is(-0,-0);                   // true
Object.is(NaN,NaN);                 // true

Object.is(0,-0);                    // false
```

The `SameValueZero()` operation -- recall, it only differs from `SameValue()` by treating `-0` and `0` as indistinguishable -- is used in quite a few more places, including:

```js
[ 1, 2, NaN ].includes(NaN);        // true
```

We can see the `0` / `-0` misdirection of `SameValueZero()` here:

```js
[ 1, 2, -0 ].includes(0);           // true  <--- oops!

(new Set([ 1, 2, 0 ])).has(-0);     // true  <--- ugh

(new Map([[ 0, "ok" ]])).has(-0);   // true  <--- :(
```

In these cases, there's a *coercion* (of sorts!) that treats `-0` and `0` as indistinguishable. No, that's not technically a "coercion" in that the type is not being changed, but I'm sort of fudging the definition to *include* this case in our broader discussion of coercion here.

Contrast the `includes()` / `has()` methods here, which activate `SameValueZero()`, with the good ol' `indexOf(..)` array utility, which instead activates `IsStrictlyEqual()` instead. This algorithm is slightly more "coercive" than `SameValueZero()`, in that it prevents `NaN` values from ever being treated as equal to each other:

```js
[ 1, 2, NaN ].indexOf(NaN);         // -1  <--- not found
```

If these nuanced quirks of `includes(..)` and `indexOf(..)` bother you, when searching -- looking for an equality match within -- for a value in an array, you can avoid any "coercive" quicks and *force* the strictest `SameValue()` equality matching, via `Object.is(..)`:

```js
vals = [ 0, 1, 2, -0, NaN ];

vals.find(v => Object.is(v,-0));            // -0
vals.find(v => Object.is(v,NaN));           // NaN

vals.findIndex(v => Object.is(v,-0));       // 3
vals.findIndex(v => Object.is(v,NaN));      // 4
```

#### Equality Operators: `==` vs `===`

The most obvious place where *coercion* is involved in equality checks is with the `==` operator. Despite any pre-conceived notions you may have about `==`, it behaves extremely predictably, ensuring that both operands match types before performing its equality check.

To state something that may or may not be super obvious: the `==` (and `===`) operators always return a `boolean` (`true` or `false`), indicating the result of the equality check; they never return anything else, regardless of what coercion may happen.

Now, recall and review the steps discussed earlier in the chapter for the `IsLooselyEqual()` operation. [^LooseEquality] Its behavior, and thus how `==` acts, can be pragmatically intuited with just these two facts in mind:

1. If the types of both operands are the same, `==` has the exact same behavior as `===` -- `IsLooselyEqual()` immediately delegates to `IsStrictlyEqual()`. [^StrictEquality]

    For example, when both operands are object references:

    ```js
    myObj = { a: 1 };
    anotherObj = myObj;

    myObj == anotherObj;                // true
    myObj === anotherObj;               // true
    ```

    Here, `==` and `===` determine that both of their respective operands are of the `object` reference type, so both equality checks behave identically; they compare the object references for equality.

2. But if the operand types differ, `==` allows coercion until they match, and prefers numeric comparison; it attempts to coerce both operands to numbers, if possible:

    ```js
    42 == "42";                         // true
    ```

    Here, the `"42"` string is coerced to a `42` number (not vice versa), and thus the comparison is then `42 == 42`, and must clearly return `true`.


Armed with this knowledge, we'll now dispel the common myth that only `===` checks the type and value, while `==` checks only the value. Not true!

In fact, `==` and `===` are both type-sensitive, each checking the types of their operands. The `==` operator allows coercion of mismatched types, whereas `===` disallows any coercion.

It's a nearly universally held opinion that `==` should be avoided in favor of `===`. I may be one of the only developers who publicly advocates a clear and straight-faced case for the opposite. I think the main reason people instead prefer `===`, beyond simply conforming to the status quo, is a lack of taking the time to actually understand `==`.

I'll be revisiting this topic to make the case for preferring `==` over `===`, later in this chapter, in "Type Aware Equality". All I ask is, no matter how strongly you currently disagree with me, try to keep an open mindset.

#### Nullish Coercion

We've already seen a number of JS operations that are nullish -- treating `null` and `undefined` as coercively equal to each other, including the `?.` optional-chaining operator and the `??` nullish-coalescing operator (see "Null'ish" in Chapter 1).

But `==` is the most obvious place that JS exposes nullish coercive equality:

```js
null == undefined;              // true
```

Neither `null` nor `undefined` will ever be coercively equal to any other value in the language, other than to each other. That means `==` makes it ergonomic to treat these two values as indistinguishable.

You might take advantage of this capability as such:

```js
if (someData == null) {
    // `someData` is "unset" (either null or undefined),
    // so set it to some default value
}

// OR:

if (someData != null) {
    // `someData` is set (neither null nor undefined),
    // so use it somehow
}
```

Remember that `!=` is the negation of `==`, whereas `!==` is the negation of `===`. Don't match the count of `=`s unless you want to confuse yourself!

Compare these two approaches:

```js
if (someData == null) {
    // ..
}

// vs:

if (someData === null || someData === undefined) {
    // ..
}
```

Both `if` statements will behave exactly identically. Which one would you rather write, and which one would you rather read later?

To be fair, some of you prefer the more verbose `===` equivalent. And that's OK. I disagree, I think the `==` version of this check is *much* better. And I also maintain that the `==` version is more consistent in stylistic spirit with how the other nullish operators like `?.` and `??` act.

But another minor fact you might consider: in performance benchmarks I've run many times, JS engines can perform the single `== null` check as shown *slightly faster* than the combination of two `===` checks. In other words, there's a tiny but measurable benefit to letting JS's `==` perform the *implicit* nullish coercion than in trying to *explicitly* list out both checks yourself.

I'd observe that even many diehard `===` fans tend to concede that `== null` is at least one such case where `==` is preferable.

#### `==` Boolean Gotcha

Aside from some coercive corner cases we'll address in the next section, probably the biggest gotcha to be aware of with `==` has to do with booleans.

Pay very close attention here, as it's one of the biggest reasons people get bitten by, and then come to despise, `==`. If you take my simple advice (at the end of this section), you'll never be a victim!

Consider the following snippet, and let's assume for a minute that `isLoggedIn` is *not* holding a `boolean` value (`true` or `false`):

```js
if (isLoggedIn) {
    // ..
}

// vs:

if (isLoggedIn == true) {
    // ..
}
```

We've already covered the first `if` statement form. We know `if` expects a `boolean`, so in this case `isLoggedIn` will be coerced to a `boolean` using the lookup table in the `ToBoolean()` abstract operation. Pretty straightforward to predict, right?

But take a look at the `isLoggedIn == true` expression. Do you think it's going to behave the same way?

If your instinct was *yes*, you've just fallen into a tricky little trap. Recall early in this chapter when I warned that the rules of `ToBoolean()` coercion only apply if the JS operation is actually activating that algorithm. Here, it seems like JS must be doing so, because `== true` seems so clearly a "boolean related" type of comparison.

But nope. Go re-read the `IsLooselyEqual()` algorithm (for `==`) earlier in the chapter. Go on, I'll wait. If you don't like my summary, go read the specification algorithm[^LooseEquality] itself.

OK, do you see anything in there that mentions invoking `ToBoolean()` under any circumstance?

Nope!

Remember: when the types of the two `==` operands are not the same, it prefers to coerce them both to numbers.

What might be in `isLoggedIn`, if it's not a `boolean`? Well, it could be a string value like `"yes"`, for example. In that form, `if ("yes") { .. }` would clearly pass the conditional check and execute the block.

But what's going to happen with the `==` form of the `if` conditional? It's going to act like this:

```js
// (1)
"yes" == true

// (2)
"yes" == 1

// (3)
NaN == 1

// (4)
NaN === 1           // false
```

So in other words, if `isLoggedIn` holds a value like `"yes"`, the `if (isLoggedIn) { .. }` block will pass the conditional check, but the `if (isLoggedIn == true)` check will not. Ugh!

What if `isLoggedIn` held the string `"true"`?

```js
// (1)
"true" == true

// (2)
"true" == 1

// (3)
NaN == 1

// (4)
NaN === 1           // false
```

Facepalm.

Here's a pop quiz: what value would `isLoggedIn` need to hold for both forms of the `if` statement conditional to pass?

...

...

...

...

What if `isLoggedIn` was holding the number `1`? `1` is truthy, so the `if (isLoggedIn)` form passes. And the other `==` form that involves coercion:

```js
// (1)
1 == true

// (2)
1 == 1

// (3)
1 === 1             // true
```

But if `isLoggedIn` was instead holding the string `"1"`? Again, `"1"` is truthy, but what about the `==` coercion?

```js
// (1)
"1" == true

// (2)
"1" == 1

// (3)
1 == 1

// (4)
1 === 1             // true
```

OK, so `1` and `"1"` are two values that `isLoggedIn` can hold that are safe to coerce along with `true` in a `==` equality check. But basically almost no other values are safe for `isLoggedIn` to hold.

We have a similar gotcha if the check is `== false`. What values are safe in such a comparison? `""` and `0` work. But:

```js
if ([] == false) {
    // this will run!
}
```

`[]` is a truthy value, but it's also coercively equal to `false`?! Ouch.

What are we to make of these gotchas with `== true` and `== false` checks? I have a plain and simple answer.

Never, ever, under any circumstances, perform a `==` check if either side of the comparison is a `true` or `false` value. It looks like it's going to behave as a nice `ToBoolean()` coercion, but it slyly won't, and will instead be ensnared in a variety of coercion corner cases (addressed in the next section). And avoid the `===` forms, too.

When you're dealing with booleans, stick to the implicitly coercive forms that are genuinely activating `ToBoolean()`, such as `if (isLoggedIn)`, and stay away from the `==` / `===` forms.

## Coercion Corner Cases

I've been clear in expressing my pro-coercion opinion thus far. And it *is* just an opinion, though it's based on interpreting facts gleaned from studying the language specification and observable JS behaviors.

That's not to say that coercion is perfect. There's several frustrating corner cases we need to be aware of, so we avoid tripping into those potholes. In case it's not clear, my following characterizations of these corner cases are just more of my opinions. Your mileage may vary.

### Strings

We already saw that the string coercion of an array looks like this:

```js
String([ 1, 2, 3 ]);                // "1,2,3"
```

I personally find that super annoying, that it doesn't include the surrounding `[ ]`. In particular, that leads to this absurdity:

```js
String([]);                         // ""
```

So we can't tell that it's even an array, because all we get is an empty string? Great, JS. That's just stupid. Sorry, but it is. And it gets worse:

```js
String([ null, undefined ]);        // ","
```

WAT!? We know that `null` coerces to the string `"null"`, and `undefined` coerces to the string `"undefined"`. But if those values are in an array, they magically just *disappear* as empty strings in the array-to-string coercion. Only the `","` remains to even hint to us there was anything at all in the array! That's just silly town, right there.

What about objects? Almost as aggravating, though in the opposite direction:

```js
String({});                         // "[object Object]"

String({ a: 1 });                   // "[object Object]"
```

Umm... OK. Sure, thanks JS for no help at all in understanding what the object value is.

### Numbers

I'm about to reveal what I think is *the* worst root of all coercion corner case evil. Are you ready for it?!?

```js
Number("");                         // 0
Number("       ");                  // 0
```

I'm still shaking my head at this one, and I've known about it for nearly 20 years. I still don't get what Brendan was thinking with this one.

The empty string is devoid of any contents; it has nothing in it with which to determine a numeric representation. `0` is absolutely ***NOT*** the numeric equivalent of missing/invalid numeric value. You know what number value we have that is well-suited to communicate that? `NaN`. Don't even get me started on how whitespace is stripped from strings when coercing to a number, so the very-much-not-empty `"       "` string is still treated the same as `""` for numeric coercion purposes.

Even worse, recall how `[]` coerces to the string `""`? By extension:

```js
Number([]);                         // 0
```

Doh! If `""` didn't coerce to `0` -- remember, this is the root of all coercion evil! --, then `[]` wouldn't coerce to `0` either.

This is just absurd, upside-down universe territory.

Much more tame, but still mildly annoying:

```js
Number("NaN");                      // NaN  <--- accidental!

Number("Infinity");                 // Infinity
Number("infinity");                 // NaN  <--- oops, watch case!
```

The string `"NaN"` is not parsed as a recognizable numeric value, so the coercion fails, producing (accidentally!) the `NaN` value. `"Infinity"` is explicitly parseable for the coercion, but any other casing, including `"infinity"`, will fail, again producing `NaN`.

This next example, you may not think is a corner case at all:

```js
Number(false);                      // 0
Number(true);                       // 1
```

It's merely programmer convention, legacy from languages that didn't originally have boolean `true` and `false` values, that we treat `0` as `false`, and `1` as `true`. But does it *really* make sense to go the other direction?

Think about it this way:

```js
false + true + false + false + true;        // 2
```

Really? I don't think there's any case where treating a `boolean` as its `number` equivalent makes any rational sense in a program. I can understand the reverse, for historical reasons: `Boolean(0)` and `Boolean(1)`.

But I genuniely feel that `Number(false)` and `Number(true)` (as well as any implicit coercion forms) should produce `NaN`, not `0` / `1`.

### Coercion Absurdity

To prove my point, let's take the absurdity up to level 11:

```js
[] == ![];                          // true
```

How!? That seems beyond credibility that a value could be coercively equal to its negation, right!?

But follow down the coercion rabbit hole:

1. `[] == ![]`
2. `[] == false`
3. `"" == false`
4. `0 == false`
5. `0 == 0`
6. `0 === 0`  ->  `true`

We've got three different absurdities conspiring against us: `String([])`, `Number("")`, and `Number(false)`; if any of these weren't true, this nonsense corner case outcome wouldn't occur.

Let me make something absolutely clear, though: none of this is `==`'s fault. It gets the blame here, of course. But the real culprits are the underlying `string` and `number` corner cases.

## Type Awareness

We've now sliced and diced and examined coercion from every conceivable angle, starting from the abstract internals of the specification, then moving to the concrete expressions and statements that actually trigger the coercions.

But what's the point of all this? Is the detail in this chapter, and indeed this whole book up to this point, mostly just trivia? Eh, I don't think so.

Let's return to the observations/questions I posed way back at the beginning of this long chapter.

There's no shortage of opinions (especially negative) about coercion. The nearly universally held position is that coercion is mostly/entirely a *bad part* of JS's language design. But inspite of that reality, most every developer, in most every JS program ever written, faces the reality that coercion cannot be avoided.

In other words, no matter what you do, you won't be able to get away from the need to be aware of, understand, and manage JS's value-types and the conversions them. Contrary to common assumptions, embracing a dynamically-typed (or even a weakly-typed) language, does *not* mean being careless or unaware of types.

Type-aware programming is always, always better than type ignorant/agnostic programming.

### Uhh... TypeScript?

Surely you're thinking at this moment: "Why can't I just use TypeScript and declare all my types statically, avoiding all the confusion of dynamic typing and coercion?"

| NOTE: |
| :--- |
| I have many more detailed thoughts on TypeScript and the larger role it plays in our ecosystem; I'll save those opinions for the appendix ("Thoughts on TypeScript"). |

Let's start by addressing head on the ways TypeScript does, and does not, aid in type-aware programming, as I'm advocating.

TypeScript is both **statically-typed** (meaning types are declared at author time and checked at compile-time) and **strongly-typed** (meaning variables/containers are typed, and these associations are enforced; strongly-typed systems also disallow *implicit* coercion). The greatest strength of TypeScript is that it typically forces both the author of the code, and the reader of the code, to confront the types comprising most (ideally, all!) of a program. That's definitely a good thing.

By contrast, JS is **dynamically-typed** (meaning types are discovered and managed purely at runtime) and **weakly-typed** (meaning variables/containers are not typed, so there's no associations to enforce, and variables can thus hold any value-types; weakly-typed systems allow any form of coercion).

| NOTE: |
| :--- |
| I'm hand-waving at a pretty high level here, and intentionally not diving deeply into lots of nuance on the static/dynamic and strong/weak typing spectrums. If you're feeling the urge to "Well, actually..." me at this moment, please just hold on a bit and let me lay out my arguments. |

### Type-Awareness *Without* TypeScript

Does a dynamically-typed system automatically mean you're programming with less type-awareness? Many would argue that, but I disagree.

I do not at all think that declaring static types (annotations, as in TypeScript) is the only way to accomplish effective type-awareness. Clearly, though, proponents of static-typing believe that is the *best* way.

Let me illustrate type-awareness without TypeScript's static typing. Consider this variable declaration:

```js
let API_BASE_URL = "https://some.tld/api/2";
```

Is that statement in any way *type-aware*? Sure, there's no `: string` annotation after `API_BASE_URL`. But I definitely think it *is* still type-aware! We clearly see the value-type (`string`) of the value being assigned to `API_BASE_URL`.

| WARNING: |
| :--- |
| Don't get distracted by the `let` declaration being re-assignable (as opposed to a `const`). JS's `const` is *not* a first-class feature of its type system. We don't really gain additional type-awareness simply because we know that reassignment of a `const` variable is disallowed by the JS engine. If the code is structured well -- ahem, structured with type-awareness as a priority -- we can just read the code and see clearly that `API_BASE_URL` is *not* reassigned and is thus still the value-type it was previously assigned. From a type-awareness perspective, that's effectively the same thing as if it *couldn't* be reassigned. |

If I later want to do something like:

```js
// are we using the secure API URL?
isSecureAPI = /^https/.test(API_BASE_URL);
```

I know the regular-expression `test(..)` method expects a string, and since I know `API_BASE_URL` is holding a string, I know that operation is type-safe.

Similarly, since I know the simple rules of `ToBoolean()` coercion as it relates to string values, I know this kind of statement is also type-safe:

```js
// do we have an API URL determined yet?
if (API_BASE_URL) {
    // ..
}
```

But if later, I start to type something like this:

```js
APIVersion = Number(API_BASE_URL);
```

A warning siren triggers in my head. Since I know there's some very specific rules about how string values coerce to numbers, I recognize that this operation is **not** type-safe. So I instead approach it differently:

```js
// pull out the version number from API URL
versionDigit = API_BASE_URL.match(/\/api\/(\d+)$/)[1];

// make sure the version is actually a number
APIVersion = Number(versionDigit);
```

I know that `API_BASE_URL` is a string, and I further know the format of its contents includes `".../api/{digits}"` at the end. That lets me know that the regular expression match will succeed, so the `[1]` array access is type-safe.

I also know that `versionDigit` will hold a string, because that's what regular-expression matches return. Now, I know it's safe to coerce that numeric-digit string into a number with `Number(..)`.

By my definition, that kind of thinking, and that style of coding, is type-aware. Type-awareness in coding means thinking carefully about whether or not such things will be *clear* and *obvious* to the reader of the code.

### Type-Awareness *With* TypeScript

TypeScript fans will point out that TypeScript can, via type inference, do static typing (enforcement) without ever needing a single type annotation in the program. So all the code examples I shared in the previous section, TypeScript can also handle, and provide its flavor of compile-time static type enforcement.

In other words, TypeScript will give us the same kind of benefit in type checking, whichever of these two we write:

```ts
let API_BASE_URL: string = "https://some.tld/api/2";

// vs:

let API_BASE_URL = "https://some.tld/api/2";
```

But there's no free-lunch. We have some issues we need to confront. First of all, TypeScript does *not* trigger an error here:

```js
API_BASE_URL = "https://some.tld/api/2";

APIVersion = Number(API_BASE_URL);
// NaN
```

Intuitively, *I* want a type-aware system to understand why that's unsafe. But maybe that's just too much to ask. Or perhaps if we actually define a more narrow/specific type for that `API_BASE_URL` variable, than simply `string`, it might help? We can use a TypeScript trick called "Template Literal Types": [^TSLiteralTypes]

```ts
type VersionedURL = `https://some.tld/api/${number}`;

API_BASE_URL: VersionedURL = "https://some.tld/api/2";

APIVersion = Number(API_BASE_URL);
// NaN
```

Nope, TypeScript still doesn't see any problem with that. Yes, I know there's an explanation for why (how `Number(..)` itself is typed).

| NOTE: |
| :--- |
| I imagine the really smart folks who *know* TypeScript well have creative ideas on how we can contort ourselves into raising an error there. Maybe there's even a dozen different ways to force TypeScript to trigger on that code. But that's not really the point. |

My point is, we cannot fully rely on TypeScript types to solve all our problems, letting us check out and remain blissfully unaware of the nuances of types and, in this case, coercion behaviors.

But! You're surely objecting to this line of argument, desperate to assert that even if TypeScript can't understand some specific situation, surely using TypeScript doesn't make it *worse*! Right!?

Let's look at what TypeScript has to say[^TSExample1] about this line:

```ts
type VersionedURL = `https://some.tld/api/${number}`;

let API_BASE_URL: VersionedURL = "https://some.tld/api/2";

let versionDigit = API_BASE_URL.match(/\/api\/(\d+)$/)[1];
// Object is possibly 'null'.
```

The error indicates that the `[1]` access isn't type-safe, because if the regular expression fails to find any match on the string, `match(..)` returns `null`.

You see, even though *I* can reason about the contents of the string compared to how the regular expression is written, and even if *I* went to the trouble to make it super clear to TypeScript exactly what those specific string contents are, it's not quite smart enough to line those two up to see that it's actually fully type-safe to assume the match happens.

| TIP: |
| :--- |
| Is it really the job of, and best use of, a type-aware tool to be contorted to express every single possible nuance of type-safety? We don't need perfect and universal tools to derive immense amounts of benefit from the stuff they *can* do. |

Moreover, comparing the code style in the previous section to the code in this section (with or without the annotations), is TypeScript actually making our coding more type-aware?

Like, does that `type VersionedURL = ..` and `API_BASE_URL: VersionedURL` stuff *actually* make our code more clearly type-aware? I don't necessarily think so.

### TypeScript Intelligence

Yes, I hear you screaming at me through the computer screen. Yes, I know that TypeScript provides what type information it discovers (or infers) to your code editor, which comes through in the form of intelligent autocompletes, helpful inline warning markers, etc.

But I'm arguing that even *those* don't, in and of themselves, make you more type-aware as a developer

Why? Because type-awareness is *not* just about the authoring experience. It's also about the reading experience, maybe even more so. And not all places/mechanisms where code is read, have access to benefit from all the extra intelligence.

Look, the magic of a language-server pumping intelligence into your code editor is unquestionably amazing. It's cool and super helpful.

And I don't begrudge TypeScript as a tool inferring things about my **JS code** and giving me hints and suggestions through delightful code editor integrations. I just don't necessarily want to *have* to annotate type information in some extremely specific way just to silence the tool's complaints.

### The Bar Above TypeScript

But even if I did/had all that, it's still not ***sufficient*** for me to be fully type-aware, both as a code-author and as a code-reader.

These tools don't catch every type error that can happen, no matter how much we want to tell ourselves they can, and no matter how many hoops and contortions we endure to wish it so. All the efforts to coax and *coerce* a tool into catching those nuanced errors, through endlessly increasing complexity of type syntax tricks, is... at best, misplaced effort.

Moreover, no such tool is immune to false positives, complaining about things which aren't actually errors; these tools will never be as smart as we are as humans. You're really wasting your time in chasing down some quirky syntax trick to quite down the tool's complaints.

There's just no substitute, if you want to truly be a type-aware code-author and code-reader, from learning how the language's built-in type systems work. And yes, that means every single developer on your team needs to spend the efforts to learn it. You can't water this stuff down just to be more attainable for less experienced developers on the project/team.

Even if we granted that you could avoid 100% of all *implicit* coercions -- you can't -- you are absolutely going to face the need to *explicit* coercions -- all programs do!

And if your response to that fact is to suggest that you'll just offload the mental burden of understanding them to a tool like TypeScript... then I'm sorry to tell you, but you're plainly and painfully falling short of the *type-aware* bar that I'm challenging all developers to strive towards.

I'm not advocating, here, for you to ditch TypeScript. If you like it, fine. But I am very explicitly and passionately challenging you: stop using TypeScript as a crutch. Stop prostrating yourself to appease the TypeScript engine overlords. Stop foolishly chasing every type rabbit down every syntactic hole.

From my observation, there's a tragic, inverse relationship between usage of type-aware tooling (like TypeScript) and the desire/effort to pursue actual type-awareness as a code-author and code-reader. The more you rely on TypeScript, the more it seems you're tempted and encouraged to shift your attention away from JS's type system (and especially, from coercion) to the alternate TypeScript type system.

Unfortunately, TypeScript can never fully escape JS's type system, because TypeScript's types are *erased* by the compiler, and what's left is just JS that the JS engine has to contend with.

| TIP: |
| :--- |
| Imagine if someone handed you a cup of filtered water to drink. And just before you took a sip, they said, "We extracted that water from the ground near a waste dump. But don't worry, we used a perfectly great filter, and that water is totally safe!" How much do you trust that filter? More to my overall point, wouldn't you feel more comfortable drinking that water if you understood everything about the source of the water, all the processes of filtration, and everything that was *in* the water of the glass in your hand!? Or is trusting that filter good enough? |

### Type Aware Equality

I'll close this long, winding chapter with one final illustration, modeling how I think developers should -- armed with more critical thinking than bandwagon conformism -- approach type-aware coding, whether you use a tool like TypeScript or not.

We'll yet again revisit equality comparisons (`==` vs `===`), from the perspective of type-awareness. Earlier in this chapter, I promised that I would make the case for `==` over `===`, so here it goes.

Let's restate/summarize what we know about `==` and `===` so far:

1. If the types of the operands for `==` match, it behaves *exactly the same* as `===`.

2. If the types of the operands for `===` do not match, it will always return `false`.

3. If the types of the operands for `==` do not match, it will allow coercion of either operand (generally preferring numeric type-values), until the types finally match; once they match, see (1).

OK, so let's take those facts and analyze how they might interact in our program.

If you are making an equality comparison of `x` and `y` like this:

```js
if ( /* are x and y equal */ ) {
    // ..
}
```

What are the possible conditions we may be in, with respect to the types of `x` and `y`?

1. We might know exactly what type(s) `x` and `y` could be, because we know how those variables are getting assigned.

2. Or we might not be able to tell what those types could be. It could be that `x` or `y` could be any type, or at least any of several different types, such that the possible combinations of types in the comparison are too complex to understand/predict.

Can we agree that (1) is far preferable to (2)? Can we further agree that (1) represents having written our code in a type-aware fashion, whereas (2) represents code that is decidedly type-*unaware*?

If you're using TypeScript, you're very likely to be aware of the types of `x` and `y`, right? Even if you're not using TypeScript, we've already shown that you can take intentional steps to write your code in such a way that the types of `x` and `y` are known and obvious.

#### (2) Unknown Types

If you're in scenario (2), I'm going to assert that your code is in a problem state. Your code is less-than-ideal. Your code needs to be refactored. The best thing to do, if you find code in this state, is... fix it!

Change the code so it's type-aware. If that means using TypeScript, and even inserting some type annotations, do so. Or if you feel you can get to the type-aware state with *just JS*, do that. Either way, do whatever you can to get to scenario (1).

If you cannot ensure the code doing this equality comparison between `x` and `y` is type-aware, and you have no other options, then you absolutely *must* use the `===` strict-equality operator. Not doing so would be supremely irresponsible.

```js
if (x === y) {
    // ..
}
```

If you don't know anything about the types, how could you (or any other future reader of your code) have any idea how the coercive steps in `==` are going to behave!? You can't.

The only responsible thing to do is, avoid coercion and use `===`.

But don't lose sight of this fact: you're only picking `===` as a last resort, when your code is so type-unaware -- ahem, type-broken! -- as to have no other choice.

#### (1) Known Types

OK, let's instead assume you're in scenario (1). You know the types of `x` and `y`. It's very clear in the code what this narrow set of types participating in the equality check can be.

Great!

But there's still two possible sub-conditions you may be in:

* (1a): `x` and `y` might already be of the same type, whether that be both are `string`s, `number`s, etc.

* (1b): `x` and `y` might be of different types.

Let's consider each of these cases individually.

##### (1a) Known Matching Types

If the types in the equality comparison match (whatever they are), we already know for certain that `==` and `===` do exactly the same thing. There's absolutely no difference.

Except, `==` *is* shorter by one character. Most developers feel instinctively that the most terse but equivalent version of something is often most preferable. That's not universal, of course, but it's a general preference at least.

```js
// this is best
if (x == y) {
    // ..
}
```

In this particular case, an extra `=` would do nothing for us to make the code more clear. In fact, it actually would make the comparison worse!

```js
// this is strictly worse here!
if (x === y) {
    // ..
}
```

Why is it worse?

Because in scenario (2), we already established that `===` is used for the last-resort when we don't know enough/anything about the types to be able to predict the outcome. We use `===` when we want to make sure we're avoiding coercion when we know coercion could occur.

But that doesn't apply here! We already know that no coercion would occur. There's no reason to confuse the reader with a `===` here. If you use `===` in a place where you already *know* the types -- and moreover, they're matched! -- that actually might send a mixed signal to the reader. They might have assumed they knew what would happen in the equality check, but then they see the `===` and they second guess themselves!

Again, to state it plainly, if you know the types of an equality comparison, and you know they match, there's only one right choice: `==`.

```js
// stick to this option
if (x == y) {
    // ..
}
```

##### (1b) Known Mismatched Types

OK, we're in our final scenario. We need to compare `x` and `y`, and we know their types, but we also know their types are **NOT** the same.

Which operator should we use here?

If you pick `===`, you've made a huge mistake. Why!? Because `===` used with known-mismatched types will never, ever, ever return `true`. It will always fail.

```js
// `x` and `y` have different types?
if (x === y) {
    // congratulations, this code in here will NEVER run
}
```

OK. So, `===` is out when the types are known and mismatched. What's our only other choice?

Well, actually, we again have two options. We *could* decide:

* (1b-1): Let's change the code so we're not trying to do an equality check with known mismatched types; that could involve explicitly coercing one or both values so they types now match, in which case pop back up to scenario (1a).

* (1b-2): If we're going to compare known mismatched types for equality, and we want any hope of that check ever passing, we *must* used `==`, because it's the only one of the equality operators which can coerce one or both operands until the types match.

```js
// `x` and `y` have different types,
// so let's allow JS to coerce them
// for equality comparison
if (x == y) {
    // .. (so, you're saying there's a chance?)
}
```

That's it. We're done. We've looked at every possible type-sensitive equality comparison condition (between `x` and `y`).

#### Summarizing Type-Sensitive Equality Comparison

The case for always preferring `==` over `===` is as follows:

1. Whether you use TypeScript or not -- but especially if you *do* use TypeScript -- the goal should be to have every single part of the code, including all equality comparisons, be *type-aware*.

2. If you know the types, you should always prefer `==`.

    - In the case where the types match, `==` is both shorter and more proper for the check.

    - In the case where the types are not matched, `==` is the only operator that can coerce operand(s) until the types match, so it's the only way such a check could ever hope to pass

3. Finally, only if you *can't* know/predict the types, for some frustrating reason, and you have no other option, fall back to using `===` as a last resort. And probably add a code comment there admitting why `===` is being used, and maybe prompting some future developer to later change the code to fix that deficiency and remove the crutch of `===`.

#### TypeScript's Inconsistency Problem

Let me be super clear: if you're using TypeScript properly, and you know the types of an equality comparison, using `===` for that comparison is just plain *wrong*! Period.

The problem is, TypeScript strangely and frustratingly still requires you to use `===`, unless it already knows that the types are matched.

That's because TypeScript either doesn't fully understand type-awareness and coercion, or -- and this is even more infuriating! -- it fully understands but it still despises JS's type system so much as to eschew even the most basic of type-aware reasoning.

Don't believe me? Think I'm being too harsh? Try this in TypeScript: [^TSExample2]

```js
let result = (42 == "42");
// This condition will always return 'false' since
// the types 'number' and 'string' have no overlap.
```

I am at a loss for words to describe how aggravating that is to me. If you've paid attention to this long, heavy chapter, you know that TypeScript is basically telling a lie here. Of course `42 == "42"` will produce `true` in JS.

Well, it's not a lie, but it's exposing a fundamental truth that so many still don't fully appreciate: TypeScript completely tosses out the normal rules of JS's type system, because TypeScript's position is that JS's type system -- and especially, implicit coercion -- are bad, and need to be replaced.

In TypeScript's world, `42` and `"42"` can never be equal to each other. Hence the error message. But in JS land, `42` and `"42"` are absolutely coercively equal to each other. And I believe I've made a strong case here that they *should be* assumed to be safely coercively equivalent.

What bothers me even more is, TypeScript has a variety of inconsistencies in this respect. TypeScript is perfectly fine with the *implicit* coercion in this code:

```js
irony = `The value '42' and ${42} are coercively equal.`;
```

The `42` gets implicitly coerced to a string when interpolating it into the sentence. Why is TypeScript ok with this implicit coercion, but not the `42 == "42"` implicit coercion?

TypeScript has no complaints about this code, either:

```js
API_BASE_URL = "https://some.tld/api/2";
if (API_BASE_URL) {
    // ..
}
```

Why is `ToBoolean()` an OK implicit coercion, but `ToNumber()` in the `==` algorithm is not?

I will leave you to ponder this: do you really think it's a good idea to write code that will ultimately run in a JS engine, but use a tool and style of code that has intentionally ejected most of an entire pillar of the JS language? Moreover, is it fine that it's also flip-flopped with a variety of inconsistent exceptions, simply to cater to the old habits of JS developers?

## What's Left?

I hope by now you're feeling a lot more informed about how JS's type system works, from primitive value types to the object types, to how type coercions are performed by the engine.

More importantly, you also now have a much more complete picture of the pros/cons of the choices we make using JS's type system, such as choosing *implicit* or *explicit* coercions at different points.

But we haven't fully covered the context in which the type system operates. For the remainder of this book, we'll turn our attention to the syntax/grammar rules of JS that govern how operators and statements behave.

[^EichCoercion]: "The State of JavaScript - Brendan Eich", comment thread, Hacker News; Oct 9 2012; https://news.ycombinator.com/item?id=4632704 ; Accessed August 2022

[^CrockfordCoercion]: "JavaScript: The World's Most Misunderstood Programming Language"; 2001; https://www.crockford.com/javascript/javascript.html ; Accessed August 2022

[^CrockfordIfs]: "json2.js", Github; Apr 21 2018; https://github.com/douglascrockford/JSON-js/blob/8e8b0407e475e35942f7e9461dab81929fcc7321/json2.js#L336 ; Accessed August 2022

[^BrendanToString]: ESDiscuss mailing list; Aug 26 2014; https://esdiscuss.org/topic/string-symbol#content-15 ; Accessed August 2022

[^AbstractOperations]: "7.1 Type Conversion", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-type-conversion ; Accessed August 2022

[^ToBoolean]: "7.1.2 ToBoolean(argument)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-toboolean ; Accessed August 2022

[^ExoticFalsyObjects]: "B.3.6 The [[IsHTMLDDA]] Internal Slot", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-IsHTMLDDA-internal-slot ; Accessed August 2022

[^OrdinaryToPrimitive]: "7.1.1.1 OrdinaryToPrimitive(O,hint)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-ordinarytoprimitive ; Accessed August 2022

[^ToString]: "7.1.17 ToString(argument)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-tostring ; Accessed August 2022

[^StringConstructor]: "22.1.1 The String Constructor", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-string-constructor ; Accessed August 2022

[^StringFunction]: "22.1.1.1 String(value)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-string-constructor-string-value ; Accessed August 2022

[^ToNumber]: "7.1.4 ToNumber(argument)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-tonumber ; Accessed August 2022

[^ToNumeric]: "7.1.3 ToNumeric(argument)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-tonumeric ; Accessed August 2022

[^NumberConstructor]: "21.1.1 The Number Constructor", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-number-constructor ; Accessed August 2022

[^NumberFunction]: "21.1.1.1 Number(value)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-number-constructor-number-value ; Accessed August 2022

[^SameValue]: "7.2.11 SameValue(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-samevalue ; Accessed August 2022

[^StrictEquality]: "7.2.16 IsStrictlyEqual(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-isstrictlyequal ; Accessed August 2022

[^LooseEquality]: "7.2.15 IsLooselyEqual(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-islooselyequal ; Accessed August 2022

[^NumericAbstractOps]: "6.1.6 Numeric Types", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-numeric-types ; Accessed August 2022

[^NumberEqual]: "6.1.6.1.13 Number:equal(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-numeric-types-number-equal ; Accessed August 2022

[^BigIntEqual]: "6.1.6.2.13 BigInt:equal(x,y)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-numeric-types-bigint-equal ; Accessed August 2022

[^LessThan]: "7.2.14 IsLessThan(x,y,LeftFirst)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-islessthan ; Accessed August 2022

[^StringPrefix]: "7.2.9 IsStringPrefix(p,q)", ECMAScript 2022 Language Specification; https://262.ecma-international.org/13.0/#sec-isstringprefix ; Accessed August 2022

[^SymbolString]: "String(symbol)", ESDiscuss mailing list; Aug 12 2014; https://esdiscuss.org/topic/string-symbol ; Accessed August 2022

[^ASMjs]: "ASM.js - Working Draft"; Aug 18 2014; http://asmjs.org/spec/latest/ ; Accessed August 2022

[^TSExample1]: "TypeScript Playground"; https://tinyurl.com/ydkjs-ts-example-1 ; Accessed August 2022

[^TSExample2]: "TypeScript Playground"; https://tinyurl.com/ydkjs-ts-example-2 ; Accessed August 2022

[^TSLiteralTypes]: "TypeScript 4.1, Template Literal Types"; https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types ; Accessed August 2022
# You Don't Know JS Yet: Types & Grammar - 2nd Edition
# Foreword

| NOTE: |
| :--- |
| Work in progress |
# You Don't Know JS Yet: Types & Grammar - 2nd Edition
# Thank You!

The following 371 Kickstarter backers generously backed the campaign to write/publish the four remaining books of the second edition. Without their faithful and patient support, these books would not have happened.

I am deeply grateful to each of you!

> Marc at Frontend Masters, Bassim, Tasos Tsournos, Lauren Clark, Simon, Appgrader, Marcos S., Noah Rodenbeek, Lichtjaeger, Jon Miller, Anil, Greg Gerard, Frank Deberle, Davide Bonifacio, Brandon Leichty, Rowdy Rabouw, Gaspar Radu, Sukumar Vaddi, Gordon, jakecodes, Leo Furze-Waddock, Nick de Jong, D. Vinci, Brian Vogel, Gareth loot, Simon Taylor, Chris O’Brien, Nayana Davis, Mark Kramer, Sunil Samuel, @nestor.j.g, Ryan McDaniel, Mert Even, Haim Yulzari, Josh Marks, Chiril Sarajiu, Barnabas Jovanovics, LynchyC, Yahya Jideh, Chris Weber, Dan Cortes, Johnny Tordgeman, Ky Lee, Brian Wisti, Steven Marrocco, Thomas Randolph, Petri Lindholm, John Cole, github, @denysmarkov, Jacob Scherber, Pierre-Yves Lebrun, mcekiera, Matthew Wasbrough, Génicot Jean-Baptiste, Adam Zając, Lenny Erlesand, Samuel Gustafsson, Hunter Jansen, Theo Armour, Nate Hargitt, Anon, Github repo, cawel, mpelikan, @farisaziz12, Ojars, Camilo Segura, Sean Seagren, Michael Vendivel, Evan, Eric Schwertfeger, Gene Garbutt, Elena Rogleva, Fiona Cheung, Anton Levholm, Lorenzo Bersano, Ando NARY, Ruben Krbashyan, Anonymous please, @jcubic, Bhavin Dave, A. Hitchcock, H0rn0chse, Yaniv Wainer, Zach, Raúl Pineda, Rohan Gupta, Karthik, Kapil, Ricardo Trejos, InvisibleLuis, BruceRobertson, Neil Lupton, Chris Schweda, Luca Mezzalira, antonio molinari, David Pinezich, Jon Barson, Nick Kaufmann, Just Andrew, Rock Kayode Winner, @omar12, Page Han, Aurélien Bottazini, Michael, Petr Siegl, Ilya Sarantsev, Alfredo Delgado, aharvard, Jannaee, Aaron McBride, Toma, epmatsw, Igor "kibertoad" Savin, Christian Rackerseder, NC Patro, Kevin, Brian Holt, Brian Ashenfelter, Selina Chang, cwavedave, Alex Grant, Craig Robertson, Eduardo Sanz Martin, oieduardorabelo, Esteban Massuh, tedhexaflow, Gershon Gerchikov, Harika Yedidi, Brad Dougherty, Nitin, Leo Balter, Syed Ahmad, Kaz de Groot, Pinnemouche Studio, Jerome Amos, Dan Poynor, John Liu, @thedavefulton, Madeline Bernard, Ikigai42, Antonio Chillaron, Sachin, Prakasam Venkatachalam, jmarti705, Mihailo23, Mihailo Pantovic, Magloire, samrudh, Mykenzie Rogers, Len, Lyza Danger Gardner, Ryan, Roman, Radojica Radivojevic, Gabrien Symons, Ryan Parker, Andrés, Merlin, rushabh_badani, notacouch, Anna Borja, Steve Albers, Marc at Frontend Masters, Bala Vemula, @chrismcdonald84, stern9, Janne Hellsten, Alexandre Madurell, Tanner Hodges, Joe Chellman, Joachim Kliemann, Stefano Frasson Pianizzola, Sergey Kochergan, Spiridonov Dmitriy, IonutBihari, Alexandru Olteanu, Javi, Marlee Peters, @vadocondes1, Gerardo Leal, Albert Sebastian, Atish Raina, Andreas Gebhardt, David Deren, Maksym Gerashchenko, Alexandru, Matt Peck, William Lacroix, Pavlo, Jon, Brett Walker, Iosif Psychas, Ferran Buireu, crs1138, Emiliano anichini, Max Koretskyi, Sander Elias, Michael Romanov, Barkóczi Dávid, Daw-Chih Liou, Dale Caffull, Amanda Dillon, Mike, Justin Hefko, Muhammad Ali Shah, Ketan Srivastav, redeemefy, Stefan Trivunčić, Manuel Juan Fosela Águila, Dragan Majstorović, Harsha C G, Himanshu, Luke, Sai Ponnada, Mark Franco, David Whittaker, Dr. Teresa Vasquez, Ian Wright, Lora Rusinouskaya, Petar, Harish, Mairead, shimon simo moyal, Sunny Puri, Максим Кочанов, Alex Georoceanu, Nicolas Carreras, damijanc, zach.dev, Coati, Brian Whitton, Denis Ciccale, Piotr Seefeld, Chase Hagwood, Amritha K, Κώστας Μηναϊδης, Trey Aughenbaugh, J David Eisenberg, Paul Thaden, Corina S, Chris Dhanaraj, Nahid Hossain, Justin McCullough, Arseny, Mark Trostler, Lucy Barker, Maaz Syed Adeeb, mcginkel, Derick Rodriguez, Helen Tsui, Rus Ustyugov, Vassilis Mastorostergios, Ryan Ewing, Rob Huelga, jinujj, ultimateoverload, Chaos, Andy Howell (spacebeers), Archana, AG Grid, theblang, Coyotiv School of Software Engineering, Ayush Rajniwal, Manish Bhatt, Shea Leslein, Jordan Chipman, jg0x42, Arvind Kumar, Eduardo Grigolo, Peter Svegrup, Jakub Kotula, William Richardson, Jonah and Ali, nicciwill, Lauren Hodges, Travis Sauer, Alexandros, Abhas, Kirankumar Ambati, Gopalakrishnan, Mika Rehman, Sreeram Sama, Shubhamsatyam Verma, Heejae Chang, Andrico karoulla, Niek Heezemans, Stanislav Horáček, Luis Ibanhi, Jasmine Wang, Yunier, Brian Barrow, Matteo Hertel, Aleksandar Milicevic, achung89, kushavi, Ahmed Fouad, Venkat Kaluva, Ian Wotkun, Andreas Näsman, ivan-siachoque, Paul Gain, Santhosh R, Gustavo Morales, ScottAwseome, Fredrik Thorkildsen, Manvel, holleB, James Sullivan, Adam Kaźmierczak, carlottosson, Alvee, Alex Reardon, Olie Chan, Fredrik S, Brett.Buskirk, Rui Sereno, Nathan Strong, lostdesign, ppseprus, James, anthonybsd, Alena Charnova, Kevin K, @codingthirty, Tim Davis, Jonathan Yee, Christa, Fabian Merchan, Nathanael McDaniel, Dave N, Brian Chirgwin, Abdulrahman (Abdu) Assabri, rmeja, Jan Václavek, Phillip Hogan, Adhithya Rajagopalan (xadhix), Jason Humphrey, Antoinette Smith, Elliot Redhead, zokocx, John Sims, Michalis Garganourakis, Adarsh Konchady, Anton Oleg Dobrovolskyy, George Tharakan, syd, Ryan D., Iris Nathan, Srishti Gupta, Miguel Rivero, @saileshraghavan, Yojan, @bgollum, Junyts, Like Ezugworie, Vsh13, LocalPCGuy, DMGabriel, Juan Tincho, William Greenlaw, atisbacsi, cris ryan tan, Jonathan Clifron, Daniel Dolich, Praj, Caisman, Michał, Mark C, 3xpedia

A special thanks to:

* A. Hitchcock
* Alexandru
* Appgrader
* Coyotiv School of Software Engineering
* Gaspar Radu
* IonutBihari
* jmarti705
* John Liu
* Syed Ahmad
* Travis Sauer
* William Greenlaw

All of you are fantastic!
